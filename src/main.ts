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
import { LaunchMinikube } from './launch-minikube';

export class Main {
  public static readonly MINIKUBE_VERSION: string = 'minikube-version';

  async initConfiguration(): Promise<Configuration> {
    const minikubeVersion = core.getInput(Main.MINIKUBE_VERSION, { required: false });

    // configuration
    return {
      minikubeVersion: () => minikubeVersion,
    };
  }

  protected async doStart(): Promise<void> {
    const configuration = await this.initConfiguration();
    const inversifyBinbding = new InversifyBinding(configuration);
    const container = await inversifyBinbding.initBindings();
    const launchMinikube = container.get(LaunchMinikube);
    await launchMinikube.execute();
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
