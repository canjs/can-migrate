import { restModel, realtimeRestModel, DefineMap, DefineList } from "can";

const M = DefineMap.extend({});
const L = DefineList.extend({});

const M2 = restModel("/foo/bar").Map;
const L2 = restModel("/foo/bar").List;

const M3 = realtimeRestModel("/foo/bar").Map;
const L3 = realtimeRestModel("/foo/bar").List;
