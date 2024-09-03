const TodoList = require('../models/TodoList');
const User = require('../models/User');

class TodoListRepository {
  async create(todo) {
    return await TodoList.create(todo);
  }

  async findById(id) {
    return await TodoList.findByPk(id);
  }

  async findByAssignedTo(id) {
    return await TodoList.findAll({where:{assigned_to:id},  order: [['id', 'DESC']]});
  }
  async findByCreatedBy(id) {
    TodoList.belongsTo(User,{foreignKey:'assigned_to'})
    return await TodoList.findAll({where:{created_by:id},order: [['id', 'DESC']],include:[{model:User,attributes:['name']}]});
  }

  async findAll() {
    return await TodoList.findAll();
  }

  async update(id, todo) {
    const result = await TodoList.update(todo, { where: { id: id } });
    if (result[0] === 0) {
      throw new Error(`TodoList with id ${id} not found`);
    }
  }

  async delete(id) {
    const result = await TodoList.destroy({ where: { id: id } });
    if (result === 0) {
      throw new Error(`TodoList with id ${id} not found`);
    }
  }
}

module.exports = TodoListRepository;
