const TodoListRepository = require('../repos/todo-repo');
const todoListRepository = new TodoListRepository();
const asynchandler = require("express-async-handler")

const create = asynchandler( async (req, res) => {
  
    const newTodo = req.body;
    const createdTodo = await todoListRepository.create({...newTodo,created_by:req.user._id});
    res.status(201).json(createdTodo);

});

const getById =  asynchandler (async (req, res) => {

    const todoId = req.params.id;
    const todo = await todoListRepository.findById(todoId);
    res.json(todo);

});

const findByAssignedTo =  asynchandler (async (req, res) => {

    // const todoId = req.params.id;
    const todo = await todoListRepository.findByAssignedTo(req.user._id)
    res.json(todo);

});

const findByCreatedBy =  asynchandler (async (req, res) => {

    // const todoId = req.params.id;
    const todo = await todoListRepository.findByCreatedBy(req.user._id)
    res.json(todo);

});

const getAll = asynchandler( async (req, res) => {

    const todos = await todoListRepository.findAll();
    res.json(todos);

});

const update = asynchandler( async (req, res) => {

    const todoId = req.params.id;
    const updatedTodo = req.body;
    await todoListRepository.update(todoId, updatedTodo);
    res.status(204).end();

});

const deleteById = asynchandler( async (req, res) => {

    const todoId = req.params.id;
    await todoListRepository.delete(todoId);
    res.status(204).end();

});

module.exports = {
  create,
  getById,
  getAll,
  update,
  deleteById,
  findByAssignedTo,
  findByCreatedBy
  
};
