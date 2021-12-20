const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Employee', {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Менеджер или обычный сотрудник",
      references: {
        model: 'Role',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Employee',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Employee_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
