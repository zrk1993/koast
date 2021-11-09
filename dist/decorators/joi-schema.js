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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuerySchame = exports.BodySchame = void 0;
require("reflect-metadata");
const joi = __importStar(require("joi"));
const constants_1 = require("../constants");
function create(type) {
    return (schemaMap) => {
        Object.keys(schemaMap).forEach(k => {
            const v = schemaMap[k];
            if (v._flags.presence !== 'required') {
                schemaMap[k] = v.allow.call(v, '', null);
            }
        });
        return (target, propertyKey) => {
            Reflect.defineMetadata(type, joi.object().keys(schemaMap), target, propertyKey);
        };
    };
}
exports.BodySchame = create(constants_1.METADATA_ROUTER_BODY_SCHAME);
exports.QuerySchame = create(constants_1.METADATA_ROUTER_QUERY_SCHAME);
//# sourceMappingURL=joi-schema.js.map