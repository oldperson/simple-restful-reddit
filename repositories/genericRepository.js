class GenericRepository {
  constructor(sequelizeModel) {
    this.sequelizeModel = sequelizeModel;
  }

  create(data) {
    return this.sequelizeModel.create(data)
      .then(model => Promise.resolve(model.toJSON()));
  }

  findOne(where) {
    return this.sequelizeModel.findOne({ where })
      .then(model => Promise.resolve(model && model.toJSON()));
  }

  update(changes, where) {
    return this.sequelizeModel.update(changes, { where })
      .then(([affectedCount]) => Promise.resolve(affectedCount));
  }
}

module.exports = GenericRepository;
