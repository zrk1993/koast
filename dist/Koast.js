"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koast = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const router_1 = require("./router");
const swagger_doc_1 = require("./middlewares/swagger-doc");
class Koast extends koa_1.default {
    constructor(options = {}) {
        super(options);
        super.use((0, koa_bodyparser_1.default)());
        this.options = options;
    }
    useRouter(routers) {
        const myRouter = new router_1.MyRouter(routers, { prefix: this.options.prefix });
        myRouter.routes(this);
    }
    useSwagger(routers) {
        (0, swagger_doc_1.useSwaggerApi)(this, routers, {
            url: '/swagger-api/doc',
            prefix: this.options.prefix
        });
    }
}
exports.Koast = Koast;
//# sourceMappingURL=Koast.js.map