import { ObservableObject } from "can";

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
}
