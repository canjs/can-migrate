import { ObservableObject } from "can";
import DeepObservable from "can-deep-observable";

class Bar extends ObservableObject {
  static get define() {
    return {
      name: 'string',
      items: {
        serialize: false,
        Type: List,
        default: () => []
      },
      list: {
        Type: List,
        Default: List
      }
    };
  }

  static get propertyDefaults() {
    return DeepObservable;
  }
}
