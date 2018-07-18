import canRoute from "can-route";
import "can-route-pushstate";

canRoute.register("{foo}", { foo: "abc" });
canRoute.register("{foo}/{bar}", { foo: "abc" });
