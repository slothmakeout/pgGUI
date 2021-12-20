const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: "1 - текущие клиенты\n0 - потенциальные"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalAddress: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Client',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Client_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
