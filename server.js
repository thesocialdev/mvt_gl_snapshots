const express = require('express');
const Map = require('./index.js');

let app = express();

app.get('/snapshot/:options', async (req, res) => {
    
    const opt = req.params.options.split(',');
    console.log(opt[4]);
    const format = opt[4].match(/(\d+)x(\d+)\.(png)/);
    console.log(format)
    const options = {
        zoom: opt[1],
        center: [opt[3], opt[2]],
        width: format[1],
        height: format[2],
        format: format[3],
    };
    console.log(options);
    const map = new Map({
        ratio: 1,
        src: opt[0],
    });
    await map.render(
        req.query.title,
        // {zoom: 7, center: [-91.6714, 30.2038], width, height},
        options,
        (snapshot) => {
            res.writeHead(200, {'Content-Type': 'image/png'});
            // res.write();
            res.end(snapshot);
        }
    );
    // osm-intl,8,30.2038,-91.6714,800x600.png?
    // lang=en&
    // domain=commons.wikimedia.org
    // &title=Data%3AInterstate+10+in+Louisiana.map
});

app.listen(3000, () => {
    console.log("The server is listening on http://localhost:3000");
});

