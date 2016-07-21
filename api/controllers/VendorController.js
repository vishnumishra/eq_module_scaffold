'use strict';

var _ = require('lodash');

/**
 * CityController
 *
 * @description :: Server-side logic for managing Organizations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base = require('../base/Controller');
module.exports = {

    list: function(data, cb) {
        
    },

    add: function(data, cb) {

        var err = base.check_req_params(req, ['code', 'name', 'state']);
        if (err) {
            return res.badRequest(err.message);
        }

        sails.models.city.create(req.body, function(err2, city) {
            if (err2) {
                sails.log.error(err2.stack);
                return res.serverError(err2.message);
            } else {
                return res.json(city);
            }
        });
    }

};
