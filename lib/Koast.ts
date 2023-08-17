import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

import { MyRouter } from './router';
import { useSwaggerApi } from './middlewares/swagger-doc';

interface options {
  env?: string | undefined,
  keys?: string[] | undefined,
  proxy?: boolean | undefined,
  subdomainOffset?: number | undefined,
  proxyIpHeader?: string | undefined,
  maxIpsCount?: number | undefined
}

export class Koast extends Koa {

  constructor(options: options = {}) {
    super(options);
    super.use(bodyparser())
  }

  public useRouter(routers: any[], opt?: { prefix: string }) {
    const myRouter = new MyRouter(routers, opt);
    myRouter.routes(this);
  }

  public useSwagger(routers: any[]) {
    useSwaggerApi(this, routers, {
      url: '/swagger-api/doc',
      prefix: '/swagger-ui',
    });
  }
}
