const canList = require('can-list');

canList.extend({
  define: {
    items: {
      Type: canList
    }
  }
});
Map.List = canList;
const myList = new canList({});
