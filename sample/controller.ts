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
