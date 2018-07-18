import canRoute from "can-route";
import RoutePushstate from "can-route-pushstate";
canRoute.urlData = new RoutePushstate();

canRoute.register("{foo}", { foo: "abc" });
canRoute.register("{foo}/{bar}", { foo: "abc" });
