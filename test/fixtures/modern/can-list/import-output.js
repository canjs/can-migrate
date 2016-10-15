import canList from 'can-list';

canList.extend({
  define: {
    items: {
      Type: canList
    }
  }
});
Map.List = canList;
const myList = new canList({});
