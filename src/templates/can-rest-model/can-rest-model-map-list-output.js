const todoConnection = restModel({
  ObjectType: Todo,
  ArrayType: TodoList,
  url: "/api/todos/{id}"
});
