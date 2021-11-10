import 'reflect-metadata';
import Koa from 'koa';
import { METADATA_ROUTER_PARAMS } from '../constants';

export function createParamDecorator(convertFunc: (ctx: Koa.Context, data?: any) => any) {
  return (data?: any) => {
    return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
      const routerParams: any[] = Reflect.getMetadata(METADATA_ROUTER_PARAMS, target, propertyKey) || [];

      routerParams.push({
        index: parameterIndex,
        convertFunc,
        data,
      });

      Reflect.defineMetadata(METADATA_ROUTER_PARAMS, routerParams, target, propertyKey);
    };
  };
}
