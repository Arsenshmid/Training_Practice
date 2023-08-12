class Entity {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  }
  
  class Repository {
    constructor() {
      this.data = [];
    }
  
    read(id) {
      return this.data.find((e) => e.id === id);
    }
  
    create(entity) {
      this.data.push(entity);
      return entity.id;
    }
  
    update(entity) {
      const index = this.data.findIndex((e) => e.id === entity.id);
      if (index === -1) {
        return false;
      }
      this.data[index] = entity;
      return true;
    }
  
    delete(id) {
      const index = this.data.findIndex((e) => e.id === id);
      if (index === -1) {
        return false;
      }
      this.data.splice(index, 1);
      return true;
    }
  }
  
  const repository = new Repository();
  
  module.exports = {
    Entity,
    Repository: repository,
  };