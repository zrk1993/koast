"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.Query = exports.Response = exports.Request = exports.Ctx = void 0;
const param_decorator_tool_1 = require("./param-decorator-tool");
exports.Ctx = (0, param_decorator_tool_1.createParamDecorator)(ctx => {
    return ctx;
});
exports.Request = (0, param_decorator_tool_1.createParamDecorator)(ctx => {
    return ctx.request;
});
exports.Response = (0, param_decorator_tool_1.createParamDecorator)(ctx => {
    return ctx.response;
});
exports.Query = (0, param_decorator_tool_1.createParamDecorator)((ctx, data) => {
    return data && ctx.request.query ? ctx.request.query[data] : ctx.request.query;
});
exports.Body = (0, param_decorator_tool_1.createParamDecorator)((ctx, data) => {
    const body = ctx.request.body;
    return data && body ? body[data] : body;
});
//# sourceMappingURL=request-params.js.map