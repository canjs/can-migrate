const TodosList = DefineList.extend({
  "#": class Model extends ObservableObject {
    static get props() {
      return {
          id: "number",
          name: "string"
      };
    }
  }
});
