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
import * as execa from 'execa';

import { injectable } from 'inversify';

/**
 * Launch minikube with all add-ons required by Eclipse Che (like ingress).
 * Try to use all memory available on Github Action Runners.
 */
@injectable()
export class MinikubeStartHelper {
  async start(): Promise<void> {
    // use options to perform the chown to let users (not root) access minikube instance
    const options: execa.Options = {
      env: {
        CHANGE_MINIKUBE_NONE_USER: 'true',
        MINIKUBE_WANTUPDATENOTIFICATION: 'false',
      },
    };
    core.info('Starting minikube...');
    const execaProcess = execa(
      'minikube',
      ['start', '--vm-driver=docker', '--addons=ingress', '--cpus', '2', '--memory', '6500'],
      options
    );
    if (execaProcess.stdout) {
      execaProcess.stdout.pipe(process.stdout);
    }
    if (execaProcess.stderr) {
      execaProcess.stderr.pipe(process.stderr);
    }
    await execaProcess;
  }
}
