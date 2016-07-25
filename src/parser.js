import _ from 'lodash';

import parseSchema from './schema';

export default function parser(schema) {
    let param = {};

    // Adjust based on what the type is of the parameter
    switch (schema._type) {
        case 'any':
            param.type = 'string';
            break;
        case 'array':
            param = parseSchema(schema);
            break;
        case 'object':
            param = parseSchema(schema);
            break;
        case 'date':
            param.type = 'string';
            param.format = 'date-time';
            break;
        default: // By default, just assign the schema type to the parameter type
            param.type = schema._type;
            break;
    }

    // Handle common flags and keys
    param.description = schema._description || '';
    param.required = _.get(schema, '_flags.presence') === 'required';

    // Only allow string and number defaults (no functions or complex objects)
    if (_.get(schema, '_flags.default') &&
        (typeof schema._flags.default === 'string' ||
        typeof schema._flags.default === 'number')) {
        param.default = schema._flags.default;
    }

    // Determine additional properties based on tests
    _.each(schema._tests, (test) => {
        switch (test.name) {
            case 'email':
                param.format = 'email';
                break;
            case 'guid':
                param.format = 'uuid';
                break;
            case 'integer':
                param.type = 'integer';
                break;
            case 'max':
                param.maximum = test.arg;
                break;
            case 'min':
                param.minimum = test.arg;
                break;
            case 'uri':
                param.format = 'url';
                break;
        }
    });

    if (_.get(schema, '_valids._set.length', 0) > 0) {
        param.enum = schema._valids._set;
    }

    return param;
}
