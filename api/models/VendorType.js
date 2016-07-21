'use strict';

var _ = require('lodash');

/**
 * vend_vendor_type.js
 *
 * @description :: Corresponds to the vend_vendor type associated with the Person.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = _.merge(_.cloneDeep(require('../base/Model')), {
    tableName: 'vend_vendor_type',
    attributes: {
        code: {
            type: 'string'
        },
        domain: {
            type: 'string'
        },
        name: {
            type:'integer'
        }
    }
});
