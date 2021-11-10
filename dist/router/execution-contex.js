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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionContex = void 0;
require("reflect-metadata");
const constants_1 = require("../constants");
class ExecutionContex {
    constructor(ContextClass, ContextClassArgs = []) {
        this.ContextClass = ContextClass;
        this.contextInstance = new ContextClass(...ContextClassArgs);
    }
    create(propertyKey) {
        return (ctx) => __awaiter(this, void 0, void 0, function* () {
            const params = this.getRouterHandlerParams(ctx, propertyKey) || [];
            try {
                const response = yield this.contextInstance[propertyKey].call(this.contextInstance, ...params);
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
    getRouterHandlerParams(ctx, propertyKey) {
        const results = [];
        const routerParams = Reflect.getMetadata(constants_1.METADATA_ROUTER_PARAMS, this.ContextClass.prototype, propertyKey) || [];
        routerParams.forEach((param) => {
            results[param.index] = this.convertParamDecorator(param, ctx);
        });
        return results;
    }
    convertParamDecorator(param, ctx) {
        return param.convertFunc(ctx, param.data);
    }
}
exports.ExecutionContex = ExecutionContex;
//# sourceMappingURL=execution-contex.js.map