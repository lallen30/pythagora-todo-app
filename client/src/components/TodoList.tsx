import { useEffect, useState } from "react";
import { Check, Trash2, Loader2 } from "lucide-react";
import { Todo } from "@/types/todo";
import { getTodos, toggleTodo, deleteTodo } from "@/api/todos";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/hooks/useToast";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load todos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    if (!todo._id) {
      console.error('Attempted to toggle todo with undefined id');
      return;
    }
    try {
      const updatedTodo = await toggleTodo(todo._id);
      setTodos(todos.map(t =>
        t._id === todo._id ? updatedTodo : t
      ));
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
    }
  };

  const handleDelete = async (todo: Todo) => {
    if (!todo._id) {
      console.error('Attempted to delete todo with undefined id');
      return;
    }
    try {
      await deleteTodo(todo._id);
      setTodos(todos.filter(t => t._id !== todo._id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo._id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant={todo.completed ? "default" : "outline"}
                size="icon"
                onClick={() => handleToggle(todo)}
                className={todo.completed ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Check className={`h-4 w-4 ${todo.completed ? "text-white" : "text-gray-400"}`} />
              </Button>
              <span className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(todo)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}
      {todos.length === 0 && (
        <div className="text-center text-muted-foreground p-8">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  );
}