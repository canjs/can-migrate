const todoConnection = restModel({
  Map: Todo,
  List: TodoList,
  url: "/api/todos/{id}"
});
