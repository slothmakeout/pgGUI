const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Task', {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contactPersonId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "Каждое задание связано с каким-либо контактным лицом.",
      references: {
        model: 'ContactPerson',
        key: 'id'
      }
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Contract',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Некоторые задания связаны с выполнением контракта, например, отправка оборудования, поставка, установка, гарантийный и послегарантийный ремонт. В таких заданиях указывается необходимая информация: номер контракта, серийный номер ремонтируемого оборудования. "
    },
    executionTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Некоторые задания имеют срок исполнения – период времени от начальной даты до финальной, другие являются бессрочными."
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: " По исполнении задания дата и время его завершения фиксируются."
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TaskType',
        key: 'id'
      }
    },
    priorityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TaskPriority',
        key: 'id'
      }
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: null,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Task',
    schema: 'public',
    hasTrigger: true,
    updatedAt: false,
    indexes: [
      {
        name: "Task_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
