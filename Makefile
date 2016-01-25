# Warning: the osrm under node_modules must be used for binary compatibility

export PATH := ./node_modules/osrm/lib/binding/:./node_modules/.bin/:$(PATH)
PROFILE := node_modules/osrm/test/data/car.lua

quebec-latest.osm.pbf:
	wget http://download.geofabrik.de/north-america/canada/quebec-latest.osm.pbf

quebec-latest.osrm: quebec-latest.osm.pbf
	osrm-extract quebec-latest.osm.pbf -p $(PROFILE)

quebec-latest.osrm.hsgr: quebec-latest.osrm
	osrm-prepare quebec-latest.osrm -p $(PROFILE) && osrm-datastore quebec-latest.osrm

test: quebec-latest.osrm.hsgr
	jasmine

clean:
	rm -f quebec-latest*

.PHONY: test clean
