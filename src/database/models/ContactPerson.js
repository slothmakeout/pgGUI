const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactPerson', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    },
    ClientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Client',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ContactPerson',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ContactPerson_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "contactperson_name_index",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
