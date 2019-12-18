import React, { Component } from "react";
import { Component as CanComponent } from "can";

class MyApp extends StacheElement {
  static get view() {
    return "Hello World";
  }

  static get props() {
    return {};
  }
};
customElements.define('my-app', MyApp);
