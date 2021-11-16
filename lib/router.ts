import 'reflect-metadata';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import { ParamValidate } from './middlewares/param-validate';

import {
  METADATA_ROUTER_METHOD,
  METADATA_ROUTER_PATH,
  METADATA_ROUTER_MIDDLEWARE,
  METADATA_ROUTER_BODY_SCHAME,
  METADATA_ROUTER_QUERY_SCHAME,
  METADATA_ROUTER_PARAMS
} from './constants';

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
    const routerInstance = new Router();
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

      this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, this.createExecutionFn(routerInstance, prop));
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

  private createExecutionFn(router: any, propertyKey: string): any {
    const routerParams: any[] =
      Reflect.getMetadata(METADATA_ROUTER_PARAMS, router, propertyKey) || [];

    return async (ctx: any) => {
      const results: any[] = [];
      routerParams.forEach((param: { index: number; convertFunc: (ctx: Koa.Context, data?: any) => any; data: any }) => {
        results[param.index] = this.convertParamDecorator(param, ctx);
      });

      try {
        const response = await router[propertyKey].call(router, ...results);
        if (ctx.body === undefined) {
          ctx.body = response;
        }
      } catch (error) {
        ctx.app.emit('error', error, ctx);
        throw error;
      }
    };
  }

  private convertParamDecorator(
    param: { index: number; convertFunc: (ctx: Koa.Context, data?: any) => any; data: any },
    ctx: Koa.Context | any,
  ): any {
    return param.convertFunc(ctx, param.data);
  }
}
