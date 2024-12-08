const Todo = require('../models/Todo');

exports.createTodo = async (userId, title) => {
  try {
    const todo = new Todo({
      title,
      user: userId,
    });
    const savedTodo = await todo.save();
    console.log(`Todo created with id: ${savedTodo._id}`);
    return savedTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

exports.getTodos = async (userId) => {
  try {
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    console.log(`Fetched ${todos.length} todos for user ${userId}`);
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

exports.updateTodo = async (todoId, userId, updates) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updates,
      { new: true }
    );
    if (!todo) {
      console.log(`Todo not found with id: ${todoId}`);
      return null;
    }
    console.log(`Todo updated with id: ${todo._id}`);
    return todo;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

exports.deleteTodo = async (todoId, userId) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    if (!todo) {
      console.log(`Todo not found with id: ${todoId}`);
      return null;
    }
    console.log(`Todo deleted with id: ${todo._id}`);
    return todo;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};