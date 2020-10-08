var fs = require('fs');
var path = require('path');
var sharp = require('sharp');
var mbgl = require('@mapbox/mapbox-gl-native');
var request = require('request');

class Map {
    
    constructor(options) {
        this.ratio = options.ratio;
        this.map = new mbgl.Map({
            request: this.tileRequest,
            ratio: this.ratio,
        });

        this.map.load(require(`./tile-sources/${options.src}.json`));
    }

    tileRequest(req, callback) {
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
    }
    
    fetchGeoJSONFromCommons(title) {
        const commonsData = JSON.parse(fs.readFileSync(`./tile-sources/${title}.json`));
        return commonsData && commonsData.jsondata && commonsData.jsondata.data;
    }
    
    render(title, params, callback) {
        let self = this;
        const { width, height } = params;
        if (title){
            // TODO
            // const geojson = this.fetchGeoJSONFromCommons(title);
            // // this.map.load();
            //
            // this.map.addSource('polygon', {
            //     type: 'geojson',
            //     data: geojson
            // });
            // this.map.addLayer({
            //     id: 'test',
            //     source: 'polygon',
            //     type: 'line',
            //     paint: {
            //         'line-color': '#fa423b',
            //         'line-opacity': 1,
            //         'line-width': 2,
            //     }
            // })
        }

        return this.map.render(params, function(err, buffer) {
            if (err) throw err;
            self.map.release();
        
            return sharp(buffer, {
                raw: {
                    width: width * self.ratio,
                    height: height * self.ratio,
                    channels: 4
                }
            })
            .png()
            .toBuffer().then(result => {
                callback(result);
            });

            // return image.toFormat('png');
            // Convert raw image buffer to PNG
            // image.toFile('image.png', function(err) {
            //     if (err) throw err;
            // });
        });
    }
}

module.exports = Map;