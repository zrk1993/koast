"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koawa = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const router_1 = require("./router");
class Koawa extends koa_1.default {
    constructor(options = {}) {
        super();
        this.use((0, koa_bodyparser_1.default)());
    }
    registerRouter(routers) {
        const myRouter = new router_1.MyRouter(routers);
        myRouter.routes(this);
    }
}
exports.Koawa = Koawa;
//# sourceMappingURL=Koawa.js.map