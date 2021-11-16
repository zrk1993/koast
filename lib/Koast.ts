import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

import { MyRouter } from './router';
import { useSwaggerApi } from './middlewares/swagger-doc';

export class Koast extends Koa {

  constructor(options = {}) {
    super();
    this.use(bodyparser())
  }

  public useRouter(routers: any[]) {
    const myRouter = new MyRouter(routers);
    myRouter.routes(this);
  }

  public useSwagger(routers: any[]) {
    useSwaggerApi(this, routers, {
      url: '/swagger-api/doc',
      prefix: '/swagger-ui',
    });
  }
}