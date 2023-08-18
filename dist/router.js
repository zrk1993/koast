"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRouter = void 0;
require("reflect-metadata");
const koa_router_1 = __importDefault(require("koa-router"));
const param_validate_1 = require("./middlewares/param-validate");
const constants_1 = require("./constants");
class MyRouter {
    constructor(routers, opt) {
        this.routers = routers;
        this.koaRouter = new koa_router_1.default(opt);
    }
    routes(koa) {
        this.routers.forEach((router) => {
            this.registerRouter(router);
        });
        koa.use(this.koaRouter.routes())
            .use(this.koaRouter.allowedMethods());
    }
    registerRouter(Router) {
        const routerInstance = new Router();
        const routerMiddlewares = this.getMiddlewares(Router);
        const requestMappings = this.getRequestMappings(Router.prototype);
        requestMappings.forEach(prop => {
            const requestPath = [
                this.prefix,
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Router),
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Router.prototype, prop),
            ].join('').replace('//', '/');
            const requestMethod = Reflect.getMetadata(constants_1.METADATA_ROUTER_METHOD, Router.prototype, prop);
            const propMiddlewares = this.getMiddlewares(Router.prototype, prop);
            const allMiddlewares = [].concat(routerMiddlewares).concat(propMiddlewares);
            const validQuerySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_QUERY_SCHAME, Router.prototype, prop);
            if (validQuerySchame) {
                allMiddlewares.push((0, param_validate_1.ParamValidate)(validQuerySchame, { type: 'query' }));
            }
            const validBodySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_BODY_SCHAME, Router.prototype, prop);
            if (validBodySchame) {
                allMiddlewares.push((0, param_validate_1.ParamValidate)(validBodySchame, { type: 'body' }));
            }
            this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, this.createExecutionFn(routerInstance, prop));
        });
    }
    getMiddlewares(target, propertyKey) {
        const middlewares = Reflect.getMetadata(constants_1.METADATA_ROUTER_MIDDLEWARE, target, propertyKey) || [];
        return middlewares.reverse();
    }
    koaRouterRegisterHelper(m) {
        switch (m) {
            case 'POST':
                return this.koaRouter.post.bind(this.koaRouter);
            default:
                return this.koaRouter.get.bind(this.koaRouter);
        }
    }
    getRequestMappings(router) {
        return Object.getOwnPropertyNames(router).filter(prop => {
            return (prop !== 'constructor' &&
                typeof router[prop] === 'function' &&
                Reflect.hasMetadata(constants_1.METADATA_ROUTER_METHOD, router, prop));
        });
    }
    createExecutionFn(router, propertyKey) {
        const routerParams = Reflect.getMetadata(constants_1.METADATA_ROUTER_PARAMS, router, propertyKey) || [];
        return (ctx) => __awaiter(this, void 0, void 0, function* () {
            const results = [];
            routerParams.forEach((param) => {
                results[param.index] = this.convertParamDecorator(param, ctx);
            });
            try {
                const response = yield router[propertyKey].call(router, ...results);
                if (ctx.body === undefined) {
                    ctx.body = response;
                }
            }
            catch (error) {
                ctx.app.emit('error', error, ctx);
                throw error;
            }
        });
    }
    convertParamDecorator(param, ctx) {
        return param.convertFunc(ctx, param.data);
    }
}
exports.MyRouter = MyRouter;
//# sourceMappingURL=router.js.map