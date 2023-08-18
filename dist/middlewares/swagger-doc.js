"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.useSwaggerApi = void 0;
require("reflect-metadata");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const koa_static_1 = __importDefault(require("koa-static"));
const SwaggerUIDist = __importStar(require("swagger-ui-dist"));
const constants_1 = require("../constants");
const convert = require('joi-to-json');
function useSwaggerApi(app, routers, swaggerConfig) {
    const pathToSwaggerUi = SwaggerUIDist.getAbsoluteFSPath();
    app.use((0, koa_mount_1.default)('/swagger-ui/index.html', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const d = yield new Promise((resolve, reject) => {
            fs.readFile(path.join(pathToSwaggerUi, 'index.html'), (err, data) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(data.toString());
            });
        });
        ctx.type = 'text/html';
        ctx.body = d.replace(/url:\s*?"\S*"/gi, `url:"${swaggerConfig.url}",docExpansion: 'none'`);
    })));
    app.use((0, koa_mount_1.default)(swaggerConfig.url, (ctx) => {
        ctx.body = generateApi(routers, swaggerConfig);
    }));
    app.use((0, koa_mount_1.default)('/swagger-ui', (0, koa_static_1.default)(pathToSwaggerUi, {
        maxage: 8640000,
    })));
}
exports.useSwaggerApi = useSwaggerApi;
const api = {
    swagger: '1.0',
    info: {
        title: '接口文档',
        version: '1.0.0',
    },
    schemes: ['http', 'https'],
    basePath: '',
    consumes: ['application/json', 'application/x-www-form-urlencoded'],
    produces: ['application/json'],
    paths: {},
    tags: [],
};
let generated = false;
function generateApi(controllers, swaggerConfig) {
    if (generated) {
        return api;
    }
    api.info.title = swaggerConfig.title || '接口文档';
    controllers.forEach(Controller => {
        const requestMappings = getRequestMappings(Controller.prototype);
        const tag = Reflect.getMetadata(constants_1.METADATA_API_TAG, Controller) || Controller.name;
        const description = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, Controller) || '';
        if (!api.tags.find(i => i.name === tag)) {
            api.tags.push({ name: tag, description });
        }
        requestMappings.forEach(prop => {
            const requestPath = [
                swaggerConfig.prefix || '',
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Controller),
                Reflect.getMetadata(constants_1.METADATA_ROUTER_PATH, Controller.prototype, prop),
            ]
                .join('')
                .replace('//', '/');
            const requestMethod = Reflect.getMetadata(constants_1.METADATA_ROUTER_METHOD, Controller.prototype, prop);
            const methodDesc = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, Controller.prototype, prop) || '';
            const method = {
                summary: methodDesc,
                tags: [tag],
                produces: ['application/json', 'application/x-www-form-urlencoded'],
                parameters: [],
                responses: { default: { description: 'successful operation' } },
            };
            const validQuerySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_QUERY_SCHAME, Controller.prototype, prop);
            if (validQuerySchame) {
                const schema = convert(validQuerySchame);
                Object.keys(schema.properties).forEach(key => {
                    const property = schema.properties[key];
                    method.parameters.push({
                        name: key,
                        in: 'query',
                        type: property.type,
                        required: !!(schema.required || []).find((i) => i === key),
                        description: key,
                    });
                });
            }
            const validBodySchame = Reflect.getMetadata(constants_1.METADATA_ROUTER_BODY_SCHAME, Controller.prototype, prop);
            if (validBodySchame) {
                const schema = convert(validBodySchame);
                method.parameters.push({
                    description: '',
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema,
                });
            }
            api.paths[requestPath] = { [requestMethod.toLowerCase()]: method };
        });
    });
    generated = true;
    return api;
}
function getRequestMappings(router) {
    return Object.getOwnPropertyNames(router).filter(prop => {
        return (prop !== 'constructor' &&
            typeof router[prop] === 'function' &&
            Reflect.hasMetadata(constants_1.METADATA_ROUTER_METHOD, router, prop));
    });
}
//# sourceMappingURL=swagger-doc.js.map