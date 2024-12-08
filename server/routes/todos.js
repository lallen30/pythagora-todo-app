const express = require('express');
const { requireUser } = require('./middleware/auth');
const TodoService = require('../services/todo');

const router = express.Router();

router.use(requireUser);

router.post('/', async (req, res) => {
  try {
    const todo = await TodoService.createTodo(req.user.id, req.body.title);
    res.status(201).json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const todos = await TodoService.getTodos(req.user.id);
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todo = await TodoService.updateTodo(req.params.id, req.user.id, req.body);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await TodoService.deleteTodo(req.params.id, req.user.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;