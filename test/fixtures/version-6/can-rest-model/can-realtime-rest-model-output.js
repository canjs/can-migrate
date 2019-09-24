const todoConnection = realtimeRestModel({
  ObjectType: Todo,
  ArrayType: TodoList,
  url: "/api/todos/{id}"
});
