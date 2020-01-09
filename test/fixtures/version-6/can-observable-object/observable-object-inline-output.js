const TodosList = DefineList.extend({
  "#": class  extends ObservableObject {
    static get props() {
      return {
          id: "number",
          name: "string"
      };
    }
  }
});
