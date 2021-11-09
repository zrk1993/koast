import { Koawa, useSwaggerApi } from '../lib/index';
import controller from './controller';

async function main() {
  const app = new Koawa();

  useSwaggerApi(app, [controller], {
    url: '/swagger-api/doc',
    prefix: '/swagger-ui',
  });

  app.registerRouter([controller]);

  app.listen(3000);
}

main()

