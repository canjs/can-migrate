import React, { Component } from "react";
import { Component as CanComponent } from "can";

CanComponent.extend({
  tag: "my-app",
  view: "Hello World",
  ViewModel: {}
});
