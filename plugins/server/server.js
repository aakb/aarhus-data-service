/**
 * @file
 * Server plugin. Adds a server.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./../../config');

module.exports = function setup(options, imports, register) {
    let app = express();

    // Parse json and urlencoded bodies.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    /**
     * Start listening to port.
     */
    app.listen(config.port);

    /**
     * Register with architect.
     */
    register(null, {
        server: app
    });
};
