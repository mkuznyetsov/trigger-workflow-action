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

@injectable()
export class WorkflowRunner {
  @inject(Configuration)
  private configuration: Configuration;

  async run(): Promise<string> {
    const appOctokit = new octokit.Octokit({
      auth: this.configuration.githubToken(),
    });

    await appOctokit.request('POST /repos/${owner}/${repo}/actions/workflows/{workflow_id}/dispatches', {
      owner: this.configuration.owner(),
      repo: this.configuration.repo(),
      workflow_id: this.configuration.workflowId(),
      inputs: {
        version: this.configuration.version(),
      },
    });

    const startedWorkflows = await appOctokit.request(
      'GET https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner: this.configuration.owner(),
        repo: this.configuration.repo(),
        workflow_id: this.configuration.workflowId(),
      }
    );
    return Promise.resolve(startedWorkflows.data.workflow_runs[0].workflow_id);
  }
}
