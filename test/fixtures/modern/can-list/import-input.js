import List from 'can/list/';

List.extend({
  define: {
    items: {
      Type: List
    }
  }
});
Map.List = List;
const myList = new List({});
