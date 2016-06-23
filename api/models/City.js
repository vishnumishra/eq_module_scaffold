'use strict';

var _ = require('lodash');

/**
 * city.js
 *
 * @description :: Corresponds to the City associated with the Person.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = _.merge(_.cloneDeep(require('../base/Model')), {
    tableName: 'city',
    attributes: {
        code: {
            type: 'string',
            primaryKey: true,
        },
        name: {
            type: 'string',
        },
        state: {
            model: 'State',
            required: true
        }
    },
    beforeCreate: function(object, cb) {
        object = this.capitalizeAttributeValues(object,['name']);
        cb();
    },
    beforeUpdate: function(object, cb) {
        object = this.capitalizeAttributeValues(object,['name']);
        cb();
    },
});
