/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Koa from 'koa';
import staticFiles from 'koa-static';
import koaNodeResolve from 'koa-node-resolve';
import {URL} from 'url';
import * as path from 'path';

import {renderModule} from '../../lib/render-module.js';
import {readableFrom} from '../../lib/readable.js';

const {nodeResolve} = koaNodeResolve;

const moduleUrl = new URL(import.meta.url);
const packageRoot = path.resolve(moduleUrl.pathname, '../../..');

const port = 8080;

// This is a fairly standard Koa server that represents how the SSR API might
// be used.
const app = new Koa();
app.use(async (ctx: Koa.Context, next: Function) => {
  // Pass through anything not the root path to static file serving
  if (ctx.URL.pathname !== '/') {
    await next();
    return;
  }

  const ssrResult = await (renderModule(
    './render-app.js',
    import.meta.url,
    'renderAppWithInitialData',
    []
  ) as Promise<Iterable<string>>);

  ctx.type = 'text/html';
  ctx.body = readableFrom(ssrResult, true);
});
app.use(nodeResolve({}));
app.use(staticFiles(packageRoot));
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
