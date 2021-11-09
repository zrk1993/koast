import Koa from 'koa';
import Ijoi from 'joi';

export * from './decorators';
export * from './Koawa';

export * from './middlewares/swagger-doc'

export const joi = Ijoi;
export interface Context extends Koa.Context {};