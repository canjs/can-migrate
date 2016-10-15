import Map from 'can/map/';
import 'can/map/define/';
import List from "can/list/";
import "can/list/sort";
import route from 'can/route/';
import 'can/route/pushstate/';
import stache from 'can/view/stache/';
import Construct from 'can/construct/';
import Control from 'can/control/';
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
