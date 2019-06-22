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

map.load(require('./style.json'));

let width = 250*ratio;
let height = 250*ratio;

map.render({zoom: 8, center: [-5.801,13.079],width, height}, function(err, buffer) {
    if (err) throw err;

    map.release();

    var image = sharp(buffer, {
        raw: {
            width,
            height,
            channels: 4
        }
    });

    // Convert raw image buffer to PNG
    image.toFile('image.png', function(err) {
        if (err) throw err;
    });
});