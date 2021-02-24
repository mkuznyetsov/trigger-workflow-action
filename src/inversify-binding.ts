/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import 'reflect-metadata';

import { Configuration } from './configuration';
import { Container } from 'inversify';
import { WorkflowChecker } from './workflow-checker';
import { WorkflowManager } from './workflow-manager';
import { WorkflowRunner } from './workflow-runner';

export class InversifyBinding {
  private container: Container;

  constructor(private configuration: Configuration) {}

  public async initBindings(): Promise<Container> {
    this.container = new Container();

    this.container.bind(WorkflowChecker).toSelf().inSingletonScope();
    this.container.bind(WorkflowManager).toSelf().inSingletonScope();
    this.container.bind(WorkflowRunner).toSelf().inSingletonScope();

    this.container.bind(Configuration).toConstantValue(this.configuration);

    return this.container;
  }
}
