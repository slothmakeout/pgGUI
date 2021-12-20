const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Employee_Task', {
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Employee',
        key: 'id'
      }
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Task',
        key: 'id'
      }
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Employee',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Employee_Task',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Employee_Task_pkey",
        unique: true,
        fields: [
          { name: "employeeId" },
          { name: "taskId" },
        ]
      },
    ]
  });
};
