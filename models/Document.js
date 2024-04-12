const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Document = db.define(
  "Document",
  {
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    documentTag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requireVerification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { tableName: "Document" }
);

module.exports = Document;
