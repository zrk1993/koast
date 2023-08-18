import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

import { MyRouter } from './router';
import { useSwaggerApi } from './middlewares/swagger-doc';

interface IOptions {
  env?: string | undefined,
  prefix?: string,
  keys?: string[] | undefined,
  proxy?: boolean | undefined,
  subdomainOffset?: number | undefined,
  proxyIpHeader?: string | undefined,
  maxIpsCount?: number | undefined
}

export class Koast extends Koa {
  private readonly options: IOptions;

  constructor(options: IOptions = {}) {
    super(options);
    super.use(bodyparser())
    this.options = options
  }

  public useRouter(routers: any[]) {
    const myRouter = new MyRouter(routers, { prefix: this.options.prefix });
    myRouter.routes(this);
  }

  public useSwagger(routers: any[]) {
    useSwaggerApi(this, routers, {
      url: '/swagger-api/doc',
      prefix: this.options.prefix
    });
  }
}
