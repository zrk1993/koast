import Koa from 'koa';
import Ijoi from 'joi';

export * from './decorators';
export * from './Koast';

export const joi = Ijoi;
export interface Context extends Koa.Context {};