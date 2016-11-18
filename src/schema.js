import _ from 'lodash';

import parser from './parser';

export default function parseSchema(schema) {
    let result = {};
    if (schema._type === 'object') {
        result.type = 'object';
        result.properties = {};
        _.each(schema._inner.children, (property) => {
            result.properties[property.key] = parser(property.schema);
        });
    } else if (schema._type === 'array') {
        result.type = 'array';
        result.items = parseSchema(schema._inner.items[0]);
    } else if (_.isObject(schema) && !schema._type) {
        result.type = 'object';
        result.properties = _.mapValues(schema, (value) => {
            if (_.isArray(value)) {
                return {
                    type: 'array',
                    items: parseSchema(value[0])
                };
            }

            return parser(value);
        });
    } else {
        return parser(schema);
    }

    result.required = _.reduce(result.properties, (arr, value, key) => {
        if (value.required) {
            arr.push(key);
        }

        return arr;
    }, []);

    _.each(result.properties, (value, key) => {
        delete result.properties[key].required;
    });

    if (result.required.length === 0) {
        delete result.required;
    }

    return result;
}
