const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Employee = db.define(
  "Employee",
  {
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    residentialAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maidenName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dependants: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    homeStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stateOfOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    homeTown: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lga: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    countryOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    altEmailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternateNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabilities: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    languages: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hobbies: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    formId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issuerOfId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    townIssued: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateIssued: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bvn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pfa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pensionNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nhfNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employmentDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeReview: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeOnboardingStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      enum: ["pending", "review", "approver", "done"],
    },
  },
  {
    tableName: "Employee",
    timestamps: true,
  }
);

module.exports = Employee;
