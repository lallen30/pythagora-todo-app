import api from './api';
import { Todo } from '@/types/todo';

export const getTodos = (): Promise<Todo[]> => {
  return api.get('/todos').then(response => response.data);
};

export const addTodo = (title: string): Promise<Todo> => {
  return api.post('/todos', { title }).then(response => response.data);
};

export const toggleTodo = (id: string): Promise<Todo> => {
  if (!id) {
    throw new Error('Todo ID is required');
  }
  return api.put(`/todos/${id}`, { completed: true }).then(response => response.data);
};

export const deleteTodo = (id: string): Promise<void> => {
  return api.delete(`/todos/${id}`).then(() => {});
};