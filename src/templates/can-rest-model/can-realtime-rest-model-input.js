const todoConnection = realtimeRestModel({
  Map: Todo,
  List: TodoList,
  url: "/api/todos/{id}"
});
