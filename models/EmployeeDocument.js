const { DataTypes } = require("sequelize");
const db = require("../config/database");

const EmployeeDocument = db.define(
  "EmployeeDocument",
  {
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      enum: ["pending", "approved", "verified"],
    },
    documentReview: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { tableName: "EmployeeDocument" }
);

module.exports = EmployeeDocument;
