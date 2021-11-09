import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

import { MyRouter } from './router';

export class Koawa extends Koa {

  constructor(options = {}) {
    super();

    this.use(bodyparser())
  }

  public registerRouter(routers: any[]) {
    const myRouter = new MyRouter(routers);
    myRouter.routes(this);
  }
}