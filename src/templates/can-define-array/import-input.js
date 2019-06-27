import DefineList from 'can-define/list/list';
import DefineList from 'can-define/list/';
import { Component, DefineList } from 'can';
import { DefineList } from 'can';
import { Component, DefineMap, DefineList, fixture, realtimeRestModel, route, domEvents, enterEvent } from "//unpkg.com/can@5/everything.mjs";

class MyList extends DefineArray {
  static get define() {
    return { '#': 'string' };
  }
}
