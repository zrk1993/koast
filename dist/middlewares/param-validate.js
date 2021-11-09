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
exports.ParamValidate = void 0;
const joiOptions = {
    allowUnknown: true,
    stripUnknown: true,
    skipFunctions: true,
};
function ParamValidate(schema, option) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const data = option.type === 'query' ? ctx.request.query : ctx.request.body;
        const result = schema.validate(data, joiOptions);
        if (result.error) {
            throw result.error;
        }
        else {
            ctx.reqData = result.value;
            if (option.type === 'query') {
                ctx.request.query = result.value;
            }
            else {
                ctx.request.body = result.value;
            }
            yield next();
        }
    });
}
exports.ParamValidate = ParamValidate;
//# sourceMappingURL=param-validate.js.map