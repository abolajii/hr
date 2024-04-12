// index.js

const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Employee = require("./Employee");
const EmployeeDocument = require("./EmployeeDocument");
const Document = require("./Document");
const EmployeeDepartment = require("./EmployeeDepartment");

// Define relationships between models
Employee.hasMany(EmployeeDocument, { foreignKey: "userId" });
EmployeeDocument.belongsTo(Employee, { foreignKey: "userId" });
EmployeeDepartment.belongsTo(Employee, { foreignKey: "userId" });

// Define tables for each model
const syncModels = async () => {
  try {
    await db.sync({ force: true }); // This will create tables based on the models
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
};

// Export models and sync function
module.exports = {
  Employee,
  EmployeeDocument,
  Document,
  EmployeeDepartment,
  syncModels,
};
