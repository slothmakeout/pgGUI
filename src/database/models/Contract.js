const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Contract', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    serialNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ContractType',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Contract',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Contract_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
