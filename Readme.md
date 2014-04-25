# New Relic Leak

This is a short prototype to illustrate the memory leak documented in issue [#134](https://github.com/newrelic/node-newrelic/issues/134). Jacob ([@groundwater](http://github.com/groundwater)) has observed that the leak only happens when the application in question queries MongoDB, and this proof of concept seems to verify this.

## Requirements

* Node (v0.10.26)
* MongoDB (v2.6 or greater)

## License

Beerware. If this happens to help you, buy me a beer (or send me more homebrewing supplies... it's your choice.)
