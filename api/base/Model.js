'use strict';

/**
 * api/base/model.js
 *
 * Base model for all sails.js models. This just contains some common code that every "nearly" every model uses.
 */
var getDbConnection = function() {
    var env = process.env.NODE_ENV;
    var argv = process.argv;

    if(env == 'test'){
        if(argv.indexOf('--local') > 0){
            return 'LocationTestLocalServer'
        }else{
            return 'LocationTestServer';   
        };
    }else{
        return 'LocationServer';
    };
};

module.exports = {

    schema: true,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    connection: getDbConnection(),
    // capitalize the given attributes value 
    capitalizeAttributeValues: function(obj, values, all, delimiter) {
        for (var key in obj) {
            // console.log(values.indexOf(key), " key=> ", key, " values=> ", values);
            if (obj[key] === '' && (typeof obj[key] != 'boolean')) {
                obj[key] = null;
            };
            if (values.indexOf(key) > -1 && typeof obj[key] == "string") {
                obj[key] = obj[key].capitalizeString(all, delimiter);
            }
        }
        return obj;
    },
    removeEmptyString: function(data) {
        for (var key in data) {
            if (data[key] == '') {
                data[key] = null;
            }
        };
        return data;
    },
    beforeCreate: function(object, cb) {
        object = this.removeEmptyString(object);
        cb();
    },
    beforeUpdate: function(object, cb) {
        object = this.removeEmptyString(object);
        cb();
    },
};
