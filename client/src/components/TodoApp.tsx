import { useState } from "react";
import { AddTodo } from "./AddTodo";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTodoAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo App</h1>
      <AddTodo onAdd={handleTodoAdded} />
      <TodoList key={refreshKey} />
    </div>
  );
}