'use strict';

var _ = require('lodash');

/**
 * vend_vendor.js
 *
 * @description :: Corresponds to the vend_vendor associated with the Person.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = _.merge(_.cloneDeep(require('../base/Model')), {
    tableName: 'vend_vendor',
    attributes: {
        extends_entity_domain: {
            type: 'string'
        },
        extends_entity_type: {
            type: 'string',
        },
        extends_entity_id: {
            type:'integer'
        },
        owner_entity_domain:{
            type:'string'
        },
        owner_entity_type:{
            type:'string'
        },
        owner_entity_id:{
            type:'integer'
        },
        type:{
            type:'string'
        },
        since:{
            type:'date'
        },
        rating:{
            type:'string'
        }
    }
});
