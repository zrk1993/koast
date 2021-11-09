import { Context, Controller, Description, Get, QuerySchame, Ctx, Query, Post, Body, BodySchame } from '../lib/index';
import * as joi from 'joi'

@Controller('/test')
@Description('测试路由')
export default class Test {
  @Get('/hi')
  @Description('get 参数')
  @QuerySchame({
    username: joi.string().required(),
    password: joi.string().required(),
  })
  async hi(@Ctx() ctx: Context, @Query() query: any) {
    return { code: 0, message: 'hi', data: query };
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