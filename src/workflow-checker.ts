/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import * as octokit from '@octokit/core';

import { inject, injectable } from 'inversify';

import { Configuration } from './configuration';
import { Octokit } from '@octokit/rest';

@injectable()
export class WorkflowChecker {
  @inject(Configuration)
  private configuration: Configuration;

  private appOctoKit: Octokit;

  workflowIsFinished(status: string, conclusion: string): boolean {
    if (!status && conclusion === '') {
      return true;
    } else {
      return false;
    }
  }

  sleep(delay: number): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  }

  async check(workflowRunId: string): Promise<void> {
    const appOctokit = new octokit.Octokit({
      auth: this.configuration.githubToken(),
    });

    let status = '';
    let conclusion = '';
    let currentTime = Date.now();
    const timeout = currentTime + this.configuration.waitTimeout() * 1000;

    while (!this.workflowIsFinished(status, conclusion) && currentTime < timeout) {
      await this.sleep(this.configuration.waitInterval() * 1000);
      const response = await appOctokit.request('POST /repos/${repo}/actions/workflows/${workflow_run_id}/runs', {
        owner: this.configuration.owner(),
        repo: this.configuration.repo(),
        workflow_run_id: workflowRunId,
      });
      [status, conclusion] = response.data;
      currentTime = Date.now();
    }
  }
}
