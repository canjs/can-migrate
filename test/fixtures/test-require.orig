const Map = require('can/map/');
require('can/map/define/');
var List = require('can/list/');
require("can/list/sort");
const route = require('can/route/');
require('can/route/pushstate/');
const stache = require('can/view/stache/');
const Construct = require('can/construct/');
const Control = require('can/control/');
import 'can/construct/super/';

route('details/{id}');
route.ready();

const map = new Map({});
const MyList = List.extend({});
Component.extend({
  viewModel: {
    define: {
      map: {
        Type: Map
      }
    }
  }  
});
Construct.extend({});
Control.extend({});
const list = new MyList();
