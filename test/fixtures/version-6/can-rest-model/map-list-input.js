import { restModel, realtimeRestModel, DefineMap, DefineList } from "can";

const M = DefineMap.extend({});
const L = DefineList.extend({});

const connection = restModel({
  Map: M,
  List: L,
  url: "/api/thing"
});

const realTimeConnection = realtimeRestModel({
  Map: M,
  List: L,
  url: "/api/thing"
});
