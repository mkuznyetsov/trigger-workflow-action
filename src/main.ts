/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import * as core from '@actions/core';

import { Configuration } from './configuration';
import { InversifyBinding } from './inversify-binding';
import { WorkflowManager } from './workflow-manager';

export class Main {
  public static readonly OWNER: string = 'owner';
  public static readonly REPO: string = 'repo';
  public static readonly WORKFLOW_ID: string = 'workflow_id';
  public static readonly WORKFLOW_NAME: string = 'workflow_name';
  public static readonly WAIT_INTERVAL: string = 'wait_interval';
  public static readonly WAIT_TIMEOUT: string = 'wait_timeout';
  public static readonly GITHUB_TOKEN: string = 'github_token';
  public static readonly VERSION: string = 'version';

  async initConfiguration(): Promise<Configuration> {
    const owner = core.getInput(Main.OWNER, { required: true });
    if (!owner) {
      throw new Error(`No repo provided (${Main.OWNER})`);
    }

    const repo = core.getInput(Main.REPO, { required: true });
    if (!repo) {
      throw new Error(`No repo provided (${Main.REPO})`);
    }

    const githubToken = core.getInput(Main.GITHUB_TOKEN, { required: true });
    if (!githubToken) {
      throw new Error(`No GitHub token provided (${Main.REPO})`);
    }

    const workflowId = core.getInput(Main.WORKFLOW_ID, { required: false });

    const workflowFileName = core.getInput(Main.WORKFLOW_NAME, { required: false });

    const version = core.getInput(Main.VERSION, { required: false });

    const waitInterval = +core.getInput(Main.WAIT_INTERVAL, { required: false });

    const waitTimeout = +core.getInput(Main.WAIT_TIMEOUT, { required: false });
    // configuration
    return {
      owner: () => owner,
      repo: () => repo,
      workflowId: () => workflowId,
      workflowName: () => workflowFileName,
      version: () => version,
      githubToken: () => githubToken,
      waitInterval: () => waitInterval,
      waitTimeout: () => waitTimeout,
    };
  }

  protected async doStart(): Promise<void> {
    const configuration = await this.initConfiguration();
    const inversifyBinbding = new InversifyBinding(configuration);
    const container = await inversifyBinbding.initBindings();
    const manager = container.get(WorkflowManager);
    await manager.execute();
  }

  async start(): Promise<boolean> {
    try {
      await this.doStart();
      return true;
    } catch (error) {
      console.error('stack=' + error.stack);
      console.error('Unable to start', error);
      return false;
    }
  }
}
