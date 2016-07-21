var _ = require('lodash'),
    util = require('sails-util'),
    buildDictionary = require('sails-build-dictionary'),
    fs = require('fs'),
    async = require('async');


module.exports = eq_module;

function eq_module(sails) {
    var npmModulesFolder = sails.config.appPath + '/node_modules/maya_vendor'/*module name*/;
    var controllerFolderPath = '/api/controllers';/*collection folder path*/
    var modelFolderPath = '/api/models';/*model folder path*/
    return {
        initialize: function(cb) {
            // Call to the eq_loadModules
            this.eq_loadModules(cb);
        },
        eq_loadModules: function(cb) {
            var self = this
                // load sails modules in parallel
            async.parallel([
                /**
                 * [loadModels Load the hook models]
                 * @param  {[function]} doneLoadModels [callback]
                 *
                 */
                    function loadModels(doneLoadModels) {
                        var modelsFolder = npmModulesFolder + modelFolderPath;
                        self.loadModels(modelsFolder, function(err, models) {
                            if (err) return doneLoadModels(err);
                            self.registerModels(models, doneLoadModels);
                        });
                    },
                    
                    /**
                     * [ Load the hook Controllers]
                     * @param  {[funcation]} doneLoadControllers [callback]
                     * 
                     */
                    function loadControllers(doneLoadControllers) {

                        var controllerFolder = npmModulesFolder + controllerFolderPath;
                        self.loadControllers(controllerFolder, function(err, controllers) {
                            if (err) return doneLoadControllers(err);
                            self.registerControllers(controllers, doneLoadControllers);
                        })
                    }
                ],
                function(err) {
                    return cb(err);
                });
        },

        loadControllers: function loadControllers(path, cb) {
            buildDictionary.optional({
                dirname: path,
                filter: /(.+)Controller\.(js|coffee|litcoffee)$/,
                flattenDirectories: true,
                keepDirectoryPath: true,
                replaceExpr: /Controller/
            }, cb);
        },
        registerControllers: function registerControllers(controllers, cb) {
            sails.controllers = _.extend(sails.controllers || {}, controllers);
            // Register controllers
            _.each(controllers, function(controller, controllerId) {

                // Override whatever was here before
                if (!util.isDictionary(sails.hooks.controllers.middleware[controllerId])) {
                    sails.hooks.controllers.middleware[controllerId] = {};
                }

 
                _.each(controller, function(action, actionId) {
                    // action ids are case insensitive
                    actionId = actionId.toLowerCase();
                    // If the action is set to `false`, explicitly disable it
                    if (action === false) {
                        delete sails.hooks.controllers.middleware[controllerId][actionId];
                        return;
                    }
                    //
                    // Ignore non-actions (special properties)
                    //

                    if (_.isString(action) || _.isBoolean(action)) {
                        return;
                    }
                    // Otherwise mix it in (this will override CRUD blueprints from above)
                    action._middlewareType = 'ACTION: ' + controllerId + '/' + actionId;
                    sails.hooks.controllers.middleware[controllerId][actionId] = action;
                    sails.hooks.controllers.explicitActions[controllerId] =
                        sails.hooks.controllers.explicitActions[controllerId] || {};
                    sails.hooks.controllers.explicitActions[controllerId][actionId] = true;
                });
            });
            return cb();
        },

        loadModels: function(path, cb) {
            // Get the main model files
            buildDictionary.optional({
                dirname: path,
                filter: /^([^.]+)\.(js)$/,
                replaceExpr: /^.*\//,
                flattenDirectories: true
            }, function(err, models) {
                if (err) {
                    return cb(err);
                }
                // Get any supplemental files
                buildDictionary.optional({
                    dirname: path,
                    filter: /(.+)\.attributes.json$/,
                    replaceExpr: /^.*\//,
                    flattenDirectories: true
                }, function(err, supplements) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, sails.util.merge(models, supplements));
                });
            });
        },
        registerModels: function(models, cb) {
            sails.models = _.extend(sails.models || {}, models);
            cb();
        }
    } // end of return;

}
