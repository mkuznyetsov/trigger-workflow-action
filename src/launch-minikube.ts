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

import { MinikubeSetupHelper } from './minikube-setup-helper';
import { MinikubeStartHelper } from './minikube-start-helper';

/**
 * Launch minikube to run Eclipse Che.
 * It may first download and install a custom minikube version if required.
 * Else it uses alread installed minikube on Github action runner to speed the start.
 */
@injectable()
export class LaunchMinikube {
  @inject(MinikubeStartHelper)
  private minikubeStartHelper: MinikubeStartHelper;

  @inject(MinikubeSetupHelper)
  private minikubeSetupHelper: MinikubeSetupHelper;

  public async execute(): Promise<void> {
    core.info('Minikube [setup]...');
    await this.minikubeSetupHelper.setup();

    core.info('Minikube [start]...');
    await this.minikubeStartHelper.start();
  }
}
