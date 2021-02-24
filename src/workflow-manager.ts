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

import { inject, injectable } from 'inversify';

import { WorkflowChecker } from './workflow-checker';
import { WorkflowRunner } from './workflow-runner';

/**
 * Workflow manager
 */
@injectable()
export class WorkflowManager {
  @inject(WorkflowRunner)
  private wokrflowRunner: WorkflowRunner;

  @inject(WorkflowChecker)
  private workflowChecker: WorkflowChecker;

  public async execute(): Promise<void> {
    core.info('Running workflow...');
    const workflowRunId = await this.wokrflowRunner.run();
    core.info('Waiting for workflow [start]...');
    await this.workflowChecker.check(workflowRunId);
  }
}
