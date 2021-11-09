"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = exports.Tag = void 0;
require("reflect-metadata");
const constants_1 = require("../constants");
const Tag = (tag) => {
    return (target, propertyKey) => {
        Reflect.defineMetadata(constants_1.METADATA_API_TAG, tag, target, propertyKey);
    };
};
exports.Tag = Tag;
const Description = (description) => {
    return (target, propertyKey) => {
        const des = Reflect.getMetadata(constants_1.METADATA_API_DESCRIPTION, target, propertyKey) || '';
        Reflect.defineMetadata(constants_1.METADATA_API_DESCRIPTION, description + ' ' + des, target, propertyKey);
    };
};
exports.Description = Description;
//# sourceMappingURL=swagger-api.js.map