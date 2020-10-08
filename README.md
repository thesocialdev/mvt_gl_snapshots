This scripts loads a GeoJSON from file and renders it with a tile from some data source.

# Running
To start with, execute:
```
npm install && npm start
```

## Seeing the snapshot by tile source

- http://localhost:3000/snapshot/bright,8,30.2038,-91.6714,800x600.png (Vector Tiles rendering using mapbox-gl-style spec)
- http://localhost:3000/snapshot/watercolor-raster,8,30.2038,-91.6714,800x600.png
- http://localhost:3000/snapshot/terrain-raster,8,30.2038,-91.6714,800x600.png
- http://localhost:3000/snapshot/wmf-raster,8,30.2038,-91.6714,800x600.png
- http://localhost:3000/snapshot/wmf-raster,8,30.2038,-91.6714,800x600.png

# Testing style conversion references

Kartotherian -> https://maps.wikimedia.org/img/osm-intl,14,22.576846,88.393078,600x500.png?lang=bn
Maputinik -> https://maputnik.github.io/editor/#14/22.57685/88.39308

# TODO

[] Fetch data from Wikimedia Commons API