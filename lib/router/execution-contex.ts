import 'reflect-metadata';
import Koa from 'koa';
import { METADATA_ROUTER_PARAMS, METADATA_ROUTER_RENDER_VIEW } from '../constants';

export class ExecutionContex {
  private readonly contextInstance: any;
  private readonly ContextClass: any;

  constructor(
    ContextClass: any,
    ContextClassArgs: any[] = [],
  ) {
    this.ContextClass = ContextClass;
    this.contextInstance = new ContextClass(...ContextClassArgs);
  }

  create(propertyKey: string): any {
    return async (ctx: any) => {
      const params: any[] = this.getRouterHandlerParams(ctx, propertyKey) || [];

      try {
        const response = await this.contextInstance[propertyKey].call(this.contextInstance, ...params);
        if (ctx.body === undefined) {
          ctx.body = response;
        }
      } catch (error) {
        ctx.app.emit('error', error, ctx);
        throw error;
      }
    };
  }

  private getRouterHandlerParams(ctx: Koa.Context, propertyKey: string): any[] {
    const results: any[] = [];
    const routerParams: any[] =
      Reflect.getMetadata(METADATA_ROUTER_PARAMS, this.ContextClass.prototype, propertyKey) || [];

    routerParams.forEach((param: { index: number; convertFunc: (ctx: Koa.Context, data?: any) => any; data: any }) => {
      results[param.index] = this.convertParamDecorator(param, ctx);
    });

    return results;
  }

  private convertParamDecorator(
    param: { index: number; convertFunc: (ctx: Koa.Context, data?: any) => any; data: any },
    ctx: Koa.Context | any,
  ): any {
    return param.convertFunc(ctx, param.data);
  }
}
