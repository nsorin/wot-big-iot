/**
 * Quantity test: set up a gateway to manage a high amount of things and check performance.
 **/

import fs = require('fs');
import path = require('path');
import http = require('http');
import coap = require('coap');
import {Api} from "../api";
import memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
});

const TEST_CONFIG_SOURCE = '../testing-resource/quantity-config.json';

fs.readFile(path.resolve(__dirname, '../../testing-resource/thing-list.txt'), (err, data) => {
    if (err) {
        console.log('Could not read thing list!', err);
        process.exit(1);
    }
    let thingUris = data.toString().split('\n').map((val) => {
        // Deal with windows line endings
        return val.replace('\r', '');
    });

    Api.getApi(TEST_CONFIG_SOURCE).then((api: Api) => {
        let promises = [];
        for (let i = 0; i < thingUris.length; i++) {
            if (thingUris[i].startsWith('http')) {
                promises.push(new Promise((resolve, reject) => {
                    http.get(thingUris[i], (res) => {
                        res.setEncoding("utf8");
                        let body = "";
                        res.on("data", data => {
                            body += data;
                        }).on("end", () => {
                            resolve(body);
                        });
                    }).on('error', function (e) {
                    });
                }));
            } else if (thingUris[i].startsWith('coap')) {
                promises.push(new Promise((resolve, reject) => {
                    let req = coap.request(thingUris[i]);
                    req.on('response', res => {
                        let payload = res.payload.toString();
                        resolve(payload);
                    });
                    req.end();
                }));
            } else {
                // Assume URI is local
                promises.push(new Promise((resolve, reject) => {
                    fs.readFile(thingUris[i], "utf-8", (err, data) => {
                        if (err) throw err;
                        resolve(data);
                    });
                }));
            }
        }
        // Call api with results
        Promise.all(promises).then((tds) => {
            console.log('Thing List Loaded');
            api.convertThings(tds).then(() => {
                console.log('Conversion made');
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.on('data', () => {
                    console.log('Shutting down...');
                    process.exit(0);
                });
            }).catch((err) => {
                console.log('Thing conversion error:', err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
});