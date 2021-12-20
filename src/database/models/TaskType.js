const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaskType', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'TaskType',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "TaskType_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
