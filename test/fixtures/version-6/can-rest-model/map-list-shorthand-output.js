import { restModel, realtimeRestModel, DefineMap, DefineList } from "can";

const M = DefineMap.extend({});
const L = DefineList.extend({});

const M2 = restModel("/foo/bar").ObjectType;
const L2 = restModel("/foo/bar").ArrayType;

const M3 = realtimeRestModel("/foo/bar").ObjectType;
const L3 = realtimeRestModel("/foo/bar").ArrayType;
