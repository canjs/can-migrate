import { ObservableObject } from "can";
import DeepObservable from "can-deep-observable";

class Foo extends ObservableObject {
  static get propertyDefaults() {
    return DeepObservable;
  }
};
