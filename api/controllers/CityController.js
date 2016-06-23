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

    list: function(req, res) {
        sails.models.city.find()
            .sort('name ASC')
            .then(function(cities) {
                return [cities];
            })
            .spread(function(cities) {
                var newData = cities.map(function(city) {
                    return {
                        city_code: city.code,
                        city_name: city.name
                    }
                });
                return res.json(newData);
            })
            .catch(function(err) {
                sails.log.error(err.stack);
                return res.serverError(err.message);
            });
    },

    add: function(req, res) {

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
