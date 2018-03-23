/**
 * @file
 * Example configuration file.
 *
 * Copy this to config.js and adjust the values to your setup.
 */

'use strict';

let config = {};

config.port = 3000;

config.logger = {
    level: 'info',
    console: false,
    files: {
        info: 'logs/info.log',
        error: 'logs/errors.log'
    }
};

module.exports = config;
