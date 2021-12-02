# [koast](https://github.com/zrk1993/koast)

A nodejs web framework, 对koa简单包装，装饰风格，内置开发常用中间件，使用typescript编写

## 快速开始

``` bash
git clone https://github.com/zrk1993/koast-start.git
```


#### 创建应用实例

```typescript main.ts
import { Koast } from '../lib/index';
import routers from './controller';

async function main() {
  const app = new Koast();

  app.useSwagger([routers])
  console.log('swagger address http://localhost:3000/swagger-ui/index.html')

  app.useRouter([routers]);
  app.listen(3000, () => {
    console.log('server start on http://localhost:3000')
  });
}

main()
```

#### 路由处理并返回数据

```typescript controller/user.ts
@Controller('/user')
export default class User {

  @Post('/chname')
  changeName() {
    return ‘hello world’;
  }
}
```

#### sample

```typescript controller/user.ts
import { joi, Use, Context, createParamDecorator, Controller, Description, Get, QuerySchame, Ctx, Query, Post, Body, BodySchame } from '../lib/index';

const testUrl = createParamDecorator((ctx, data) => {
  return ctx.URL + data
});

@Controller('/test')
@Description('测试路由')
export default class Test {
  @Get('/hi')
  @Description('get 参数')
  @QuerySchame({
    username: joi.string().required(),
    password: joi.string().required(),
  })
  @Use(async (ctx, next) => {
    console.log('use middleware');
    await next();
  })
  async hi(@Ctx() ctx: Context, @Query() query: any, @testUrl('自定义参数装饰器') urrl: any) {
    return { code: 0, message: 'hi', data: query, urrl };
  }

  @Post('/test2')
  @BodySchame({
    username: joi.string().required(),
    password: joi.string().required(),
  })
  changeName(@Body() body: any) {
    return { code: 0, data: body };
  }
}

```


#### 请求参数验证

```typescript
@Controller('/user')
@Role(SYS_ROLE.admin)
export default class User {

  @Post('/chname')
  @QuerySchame({
    username: joi.string().required(),
    password: joi.string().required(),
  })
  changeName(@Body() body: any, @Query() query: any) {
    return ResultUtils.ok(body);
  }
}

```

#### 接口描述

接口文档默认访问地址: /swagger-ui/index.html

```typescript
@Controller('/user')
@Description('用户信息')
export default class User {

  @Post('/hi')
  @Description('test')
  test() {}
}

```

## API

### http请求装饰器

内部使用koa-router中间件，提供对应的方法的装饰器

- @Controller(string|void)

- @POST(string|void)

- @Get(string|void)

### @Render(view: string) 模板渲染


### 使用[Joi](https://www.npmjs.com/package/joi)验证请求参数

- BodySchame(schame: joi.AnySchema)

- QuerySchame(schame: joi.AnySchema)


### 控制器处理方法参数注入

```typescript
@Post('/test')
test(@Body() Body: any, @Query() query: any) {}
  
 ```

 
### 自定义装饰器

```typescript
import { Use, Description } from 'koast';
export default function Role(...roles: string[]) {
  const role = Use(async (ctx: Koa.Context, next: () => void) => {
    const sql = `
      SELECT R.code FROM role R
      LEFT JOIN user_roles UR ON UR.role_id = R.id
      WHERE UR.user_id = ?
    `;
    const userRoles = await db.query(sql, [signData.id]);
    if (roles.some(r => userRoles.find(ur => ur.code === r))) {
      await next();
    } else {
      throw new Error('no authorization!');
    }
  });

  const description = Description(`【${roles.join()}】`);

  return (target: any, propertyKey?: string) => {
    role(target, propertyKey);
    description(target, propertyKey);
  };
}  

// 使用装饰器
@Controller('/system/role')
@Role(SYS_ROLE.admin)
export class RoleController {
  @Get('/list')
  @Description('角色列表')
  async list() { }
}
 ```
 
 提供如下装饰器

- @Ctx() - ctx
- @Request() - ctx.request
- @Response() - ctx.Response
- @Query(string|void) - ctx.request.query[string] | ctx.request.query
- @Body(string|void) - ctx.request.body[string] | ctx.request.body

- @ApplicationInstance() - 当前应用实例
- @KoaInstance() - 当前koa实例
