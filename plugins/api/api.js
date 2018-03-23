/**
 * @file
 * Api module.
 */
'use strict';

const config = require('./../../config');
const axios = require('axios');
const csv = require('parse-csv');

module.exports = function setup (options, imports, register) {
    const eventBus = imports.eventbus;
    const server = imports.server;
    const logger = imports.logger;

    /**
     * GET: /birthday?url=[Url to csv file]&limit=[Limit results length]
     */
    server.get('/birthday', (req, res) => {
        if (!req.query.hasOwnProperty('url')) {
            logger.info('No url parameter. Bad request.');
            res.status(400).send('No url.');
            return;
        }

        let url = req.query.url;
        let limit = req.query.limit;

        axios.get(url)
            .then(function (response) {
                let data = response.data;

                let parsed = csv.toJSON(data);

                let now = new Date();
                let day = now.getDate();
                let month = now.getMonth() + 1;

                let birthdays = [];

                for (let key in parsed) {
                    if (parsed.hasOwnProperty(key)) {
                        let entry = parsed[key];

                        let split = entry.val1.split('/');

                        if (split.length === 2) {
                            entry.day = split[0];
                            entry.month = split[1];

                            birthdays.push({
                                name: entry.val0,
                                birthday: entry.val1,
                                day: parseInt(entry.day),
                                month: parseInt(entry.month)
                            });
                        }
                    }
                }

                // Sort dates.
                birthdays.sort((a, b) => {
                    if (a.month < b.month) {
                        return -1;
                    }
                    else if (a.month > b.month) {
                        return 1;
                    }
                    else {
                        if (a.day === b.day) {
                            return 0;
                        }
                        else if (a.day > b.day) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                });

                // Move passed birthdays to end of array.
                let i = 0;
                while (i < birthdays.length) {
                    let entry = birthdays[i];
                    i++;

                    if (entry.month < month || (entry.month === month && entry.day < day)) {
                        entry = birthdays.shift();
                        birthdays.push(entry);
                    }
                    else {
                        break;
                    }
                }

                if (limit > 0) {
                    birthdays = birthdays.slice(0, Math.min(limit, birthdays.length));
                }

                // Inject header array element.
                birthdays.unshift({
                    type: 'header',
                    columns: [
                        {
                            title: 'Navn',
                            field: 'name'
                        },
                        {
                            title: 'Fødselsdag',
                            field: 'birthday'
                        }
                    ]
                });

                res.json(birthdays);
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
