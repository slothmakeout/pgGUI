const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaskPriority', {
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
    tableName: 'TaskPriority',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "TaskPriority_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
