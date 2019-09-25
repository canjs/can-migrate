import { restModel, realtimeRestModel, DefineMap, DefineList } from "can";

const M = DefineMap.extend({});
const L = DefineList.extend({});

const connection = restModel({
  ObjectType: M,
  ArrayType: L,
  url: "/api/thing"
});

const realTimeConnection = realtimeRestModel({
  ObjectType: M,
  ArrayType: L,
  url: "/api/thing"
});
