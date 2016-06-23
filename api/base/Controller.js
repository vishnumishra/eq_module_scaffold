'use strict';

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var _ = require('lodash');


/**
 * BaseController.js
 *
 * Base controller for all sails.js controllers. This just contains some common code
 * that every controller uses
 */
module.exports = {
    /**
     * Generic count action for controller.
     *
     * @param   {Request}   request
     * @param   {Response}  response
     */
    count: function count(request, response) {
        var Model = actionUtil.parseModel(request);

        Model
            .count(actionUtil.parseCriteria(request))
            .exec(function found(error, count) {
                if (error) {
                    response.negotiate(error);
                } else {
                    response.ok({ count: count });
                }
            });
    },

    check_req_params: function check_req_params(req, params) {
        var i;
        var p;
        for (i = 0; i < params.length; ++i) {
            p = req.param(params[i]);
            if (!p) {
                return new Error("Missing input parameter '" + params[i] + "'");
            }
        }
    },

    check_param_anyone: function check_param_anyone(req, params) {
        var i;
        var p;
        var str;
        for (i = 0; i < params.length; ++i) {
            p = req.param(params[i]);
            if (p) {
                return;
            } else {
                if (_.isUndefined(str)) {
                    str = params[i];
                } else {
                    str = str + ", " + params[i];
                }

            }
        }
        return new Error("At least one of the following input parameters required '" + str + "'");
    },

    check_params_valid: function check_param_anyone(req, validParams) {
        // this is an array
        var i, j;
        for (i = 0; i < req.params.length; ++i) {
            if (_.indexOf(validParams, req.params[i]) == -1) {
                return new Error("Invalid url parameter=" + req.params[i]);
            }
        }
        // this is an object
        for (j in req.body) {
            if (_.indexOf(validParams, j) == -1) {
                return new Error("Invalid request parameter=" + j);
            }
        }

    },

    check_valid_calendar_year: function check_valid_calendar_year(yyyy) {
        if (!(yyyy > 1900) && (yyyy < 2100)) {
            return new Error("Year should be between 1900 and 2100");
        }
    },

    check_valid_birth_year: function check_valid_birth_year(yyyy) {
        var thisYear = (new Date()).getFullYear();
        var minus15years = thisYear - 15;
        if (!(yyyy > 1900) && (yyyy < minus15years)) {
            return new Error("Year should be between 1900 and " + minus15years);
        }
    },

    get_boolean: function get_boolean(str) {
        if (str === "TRUE" || str === "true") {
            return true;
        } else {
            return false;
        }
    },

    // following method never used nor tested. can be a better way
    query_join: function query_join(arr1, arr2, join_param, addParams) {
        var i;
        var j;
        var k;
        for (i = 0; i < arr1.length; ++i) {
            for (j = 0; j < arr2.length; ++j) {
                if (arr1[i][join_param] == arr2[j][join_param]) {
                    for (k = 0; k < addParams.length; ++k) {
                        arr1[i][addParams[k]] = arr2[j][addParams[k]];
                    }
                    break;
                }
            }
        }
        return arr1;
    },
    _checkAddressParams: function(req) {
        var err = this.check_req_params(req, ['id', 'domain', 'line1', 'PIN', 'state', 'country']);
        if (err) {
            return err;
        }

        var err = this.check_params_valid(req, ['id', 'domain', 'line1', 'line2', 'line3',
            'landmark', 'tehsil', 'panchayat', 'village', 'PIN', 'state', 'country',
            'district', 'city'
        ]);
        if (err) {
            return err;
        }
        err = this.check_param_anyone(req, ['district', 'city']);

        var err = this.check_req_params(req, ['id']);
        if (err) {
            return err;
        }
    },
    check_n_number_of_params: function check_n_number_of_params(reqParam, params, number) {
        var i, p, str, count = 0;

        for (i = 0; i < params.length; ++i) {
            p = reqParam[params[i]];
            if (p) {
                count++;
            }
            if (count >= number) {
                return;
            }
            (str) ? (str += ", " + params[i]) : (str = params[i]);
        }
        return new Error("At least " + number + " of the following input parameters required '" + str + "'");
    },
    sendError: function(res, err) {
        var eCode = err.code || 400;
        return res.json(eCode, err);
    }

};
