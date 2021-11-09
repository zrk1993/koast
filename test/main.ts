import { Koawa, useSwaggerApi } from '../lib/index';
import controller from './controller'

const app = new Koawa({
  routers: [controller]
});

useSwaggerApi(app, [controller], {
  url: '/swagger-api/doc',
  prefix: '/swagger-ui',
});

app.listen(3000);