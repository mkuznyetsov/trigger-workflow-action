/**********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
export const Configuration = Symbol.for('Configuration');
export interface Configuration {
  owner(): string;
  repo(): string;
  version(): string;
  workflowId(): number;
  workflowName(): string | undefined;
  githubToken(): string;
  waitInterval(): number;
  waitTimeout(): number;
}
