"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRouter = void 0;
require("reflect-metadata");
const koa_router_1 = __importDefault(require("koa-router"));
const execution_contex_1 = require("./execution-contex");
const param_validate_1 = require("../middlewares/param-validate");
const constants_1 = require("../constants");
class MyRouter {
    constructor(routers) {
        this.routers = routers;
        this.koaRouter = new koa_router_1.default();
    }
    routes(koa) {
        this.routers.forEach((router) => {
            this.registerRouter(router);
        });
        koa.use(this.koaRouter.routes())
            .use(this.koaRouter.allowedMethods());
    }
    registerRouter(Router) {
        const executionContex = new execution_contex_1.ExecutionContex(Router);
        const routerMiddlewares = this.getMiddlewares(Router);
        const requestMappings = this.getRequestMappings(Router.prototype);
        requestMappings.forEach(prop => {
            const requestPath = [
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
            this.koaRouterRegisterHelper(requestMethod)(requestPath, ...allMiddlewares, executionContex.create(prop));
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
}
exports.MyRouter = MyRouter;
//# sourceMappingURL=index.js.map