import DefineArray from 'can-define-array';
import DefineArray from 'can-define-array';
import { Component, DefineArray } from 'can';
import { DefineArray } from 'can';
import { Component, DefineMap, DefineArray, fixture, realtimeRestModel, route, domEvents, enterEvent } from "//unpkg.com/can@5/everything.mjs";

class MyList extends DefineArray {
  static get define() {
    return { '#': 'string' };
  }
}
