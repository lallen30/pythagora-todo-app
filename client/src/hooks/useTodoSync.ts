import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '@/api/todos';

export function useTodoSync() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const serverTodos = await getTodos();
      const localTodos = JSON.parse(localStorage.getItem('todos') || '[]');

      // Merge server and local todos, prioritizing server data
      const mergedTodos = serverTodos.map(serverTodo => {
        const localTodo = localTodos.find(lt => lt.id === serverTodo.id);
        return localTodo ? { ...localTodo, ...serverTodo } : serverTodo;
      });

      setTodos(mergedTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
      // Fallback to local todos if server request fails
      const localTodos = JSON.parse(localStorage.getItem('todos') || '[]');
      setTodos(localTodos);
    } finally {
      setLoading(false);
    }
  };

  const addTodoItem = async (title: string) => {
    try {
      const newTodo = await addTodo(title);
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      // Optimistically add todo locally
      const optimisticTodo: Todo = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos(prevTodos => [...prevTodos, optimisticTodo]);
    }
  };

  const toggleTodoItem = async (id: string) => {
    try {
      const updatedTodo = await toggleTodo(id);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return {
    todos,
    loading,
    addTodoItem,
    toggleTodoItem,
    deleteTodoItem,
  };
}