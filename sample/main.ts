import { Koawa } from '../lib/index';
import routers from './controller';

async function main() {
  const app = new Koawa();

  app.useSwagger([routers])
  console.log('swagger address http://localhost:3000/swagger-ui/index.html')

  app.useRouter([routers]);
  app.listen(3000, () => {
    console.log('server start on http://localhost:3000')
  });
}

main()

