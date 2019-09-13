var fs = require('fs');
var path = require('path');
var mbgl = require('@mapbox/mapbox-gl-native');
var sharp = require('sharp');
var request = require('request');

let ratio = 1;
var options = {
  request: function(req, callback) {
    console.log(req.url);
    request({
            url: req.url,
            encoding: null,
            gzip: true
        }, function (err, res, body) {
            if (err) {
                callback(err);
            } else if (res.statusCode == 200) {
                var response = {};

                if (res.headers.modified) { response.modified = new Date(res.headers.modified); }
                if (res.headers.expires) { response.expires = new Date(res.headers.expires); }
                if (res.headers.etag) { response.etag = res.headers.etag; }
                response.data = body;
                callback(null, response);
            } else {
                callback(new Error(JSON.parse(body).message));
            }
        });
  },
  ratio
};

var map = new mbgl.Map(options);
let geojson = JSON.parse(fs.readFileSync('./polygon.json'));
map.load(require('./bright.json'));
let width = 600;
let height = 500;
map.render({zoom: 13, center: [88.393078, 22.576846], width, height}, function(err, buffer) {
    if (err) throw err;

    map.release();

    var image = sharp(buffer, {
        raw: {
            width: width * ratio,
            height: height * ratio,
            channels: 4
        }
    });

    // Convert raw image buffer to PNG
    image.toFile('image.png', function(err) {
        if (err) throw err;
    });
});