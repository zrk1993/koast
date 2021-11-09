"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.Post = exports.Get = void 0;
require("reflect-metadata");
const constants_1 = require("../constants");
function createRequestMapping(method) {
    return (path) => {
        return (target, propertyKey) => {
            Reflect.defineMetadata(constants_1.METADATA_ROUTER_PATH, path || '', target, propertyKey);
            Reflect.defineMetadata(constants_1.METADATA_ROUTER_METHOD, method, target, propertyKey);
        };
    };
}
exports.Get = createRequestMapping('GET');
exports.Post = createRequestMapping('POST');
const Controller = (path) => {
    return (target) => {
        Reflect.defineMetadata(constants_1.METADATA_ROUTER_PATH, path || '/', target);
    };
};
exports.Controller = Controller;
//# sourceMappingURL=request-mapping.js.map