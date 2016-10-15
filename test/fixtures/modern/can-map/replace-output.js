const canMap = require('can-map');

canMap.extend({
  define: {
    items: {
      Type: canMap
    }
  }
});

List.Map = canMap;
const myMap = new canMap({});
