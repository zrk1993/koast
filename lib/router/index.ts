import 'reflect-metadata';
import KoaRouter from 'koa-router';
import * as Koa from 'koa';
import { ExecutionContex } from './execution-contex';
import { ParamValidate } from '../middlewares/param-validate';

import {
  METADATA_ROUTER_METHOD,
  METADATA_ROUTER_PATH,
  METADATA_ROUTER_MIDDLEWARE,
  METADATA_ROUTER_BODY_SCHAME,
  METADATA_ROUTER_QUERY_SCHAME,
} from '../constants';

export class MyRouter {
  private readonly routers: any[];
  private readonly koaRouter: KoaRouter;

  constructor(routers: any[]) {
    this.routers = routers;
    this.koaRouter = new KoaRouter();
  }

  routes(koa: Koa) {
    this.routers.forEach((router: any) => {
      this.registerRouter(router);
    });

    koa.use(this.koaRouter.routes())
      .use(this.koaRouter.allowedMethods());
  }

  private registerRouter(Router: any) {
    const executionContex = new ExecutionContex(Router);
    const routerMiddlewares = this.getMiddlewares(Router);
    const requestMappings = this.getRequestMappings(Router.prototype);

    requestMappings.forEach(prop => {
      const requestPath: string = [
        Reflect.getMetadata(METADATA_ROUTER_PATH, Router),
        Reflect.getMetadata(METADATA_ROUTER_PATH, Router.prototype, prop),
      ].join('').replace('//', '/');
      const requestMethod: string = Reflect.getMetadata(METADATA_ROUTER_METHOD, Router.prototype, prop);

      const propMiddlewares = this.getMiddlewares(Router.prototype, prop);
      const allMiddlewares = [].concat(routerMiddlewares).concat(propMiddlewares);

      const validQuerySchame = Reflect.getMetadata(METADATA_ROUTER_QUERY_SCHAME, Router.prototype, prop);
      if (validQuerySchame) {
        allMiddlewares.push(ParamValidate(validQuerySchame, { type: 'query' }));
      }
      const validBodySchame = Reflect.getMetadata(METADATA_ROUTER_BODY_SCHAME, Router.prototype, prop);
      if (validBodySchame) {
        allMiddlewares.push(ParamValidate(validBodySchame, { type: 'body' }));
      }

      this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, executionContex.create(prop));
    });
  }

  private getMiddlewares(target: any, propertyKey?: string): Koa.Middleware[] {
    const middlewares: Koa.Middleware[] = Reflect.getMetadata(METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];
    return middlewares.reverse();
  }

  private koaRouterRegisterHelper(m: string) {
    switch (m) {
      case 'POST':
        return this.koaRouter.post.bind(this.koaRouter);
      default:
        return this.koaRouter.get.bind(this.koaRouter);
    }
  }

  private getRequestMappings(router: any): string[] {
    return Object.getOwnPropertyNames(router).filter(prop => {
      return (
        prop !== 'constructor' &&
        typeof router[prop] === 'function' &&
        Reflect.hasMetadata(METADATA_ROUTER_METHOD, router, prop)
      );
    });
  }
}
