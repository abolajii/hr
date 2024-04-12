const Employee = require("../models/Employee");
const Document = require("../models/Document");
const EmployeeDocument = require("../models/EmployeeDocument");
const path = require("path");
const fs = require("fs");
const { EmployeeDepartment } = require("../models");
const { generatePassword, sendMessage } = require("../helpers");

const allDocuments = async (req, res) => {
  try {
    // Fetch all documents from the database
    const documents = await Document.findAll();

    // Send a success response with the list of documents
    res.status(200).json(documents);
  } catch (error) {
    // Handle any errors that occur during fetching documents
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

const allEmployees = async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await Employee.findAll();

    // Send a success response with the retrieved employees
    res.status(200).json(employees);
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

const editDocument = async (req, res) => {
  try {
    // Extract document data from request body

    const { documentId } = req.params;
    const { documentTag, documentName, requireVerification } = req.body;

    // Find the document to update by its ID
    let document = await Document.findByPk(documentId);

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Update the document attributes
    document.documentTag = documentTag;
    document.documentName = documentName;
    document.requireVerification = requireVerification
      ? requireVerification
      : false;

    // Save the updated document to the database
    document = await document.save();

    // Send a success response with the updated document data
    res.status(200).json(document);
  } catch (error) {
    // Handle any errors that occur during document editing
    console.error("Error editing document:", error);
    res.status(500).json({ message: "Failed to edit document" });
  }
};

const updateEmployee = async (req, res) => {
  const files = req.files.files;
  const employee = await Employee.findOne({
    where: {
      id: req.user.employee.id,
    },
    include: {
      model: EmployeeDocument,
    },
  });

  const { surname, first_name } = employee;

  const uploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    `${surname.toUpperCase()} ${first_name.toUpperCase()}`
  );

  if (!fs.existsSync(uploadDir)) {
    try {
      // Create the directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create directory:", error);
      return res.status(500).json({ error: "Failed to create directory" });
    }
  }

  if (Array.isArray(files)) {
    try {
      files.forEach((each) => {
        const fileName = `${first_name.toLowerCase()}_${each.name
          .split(" ")
          .join("_")}.${each.mimetype.split("/")[1]}`;
        const documentDir = path.join(uploadDir, each.name.toUpperCase());
        const filePath = path.join(documentDir, fileName);

        // Check if the directory for the document exists
        if (!fs.existsSync(documentDir)) {
          fs.mkdirSync(documentDir, { recursive: true });
        }

        // Write the file to the specified path
        fs.writeFileSync(filePath, each.data);

        // Log file path and contents after writing
        console.log("File written:", filePath);
      });
      return res.status(201).json({ message: "Updated document" });
    } catch (error) {
      console.error("Failed to update document:", error);
      return res.status(500).json({ error: "Failed to update document" });
    }
  }

  if (typeof files === "object") {
    const fileName = `${first_name.toLowerCase()}_${files.name
      .split(" ")
      .join("_")}.${files.mimetype.split("/")[1]}`;
    const documentDir = path.join(uploadDir, files.name.toUpperCase());
    const filePath = path.join(documentDir, fileName);

    // Check if the directory for the document exists
    if (!fs.existsSync(documentDir)) {
      fs.mkdirSync(documentDir, { recursive: true });
    }

    // Write the file to the specified path
    fs.writeFileSync(filePath, files.data);

    // Log file path and contents after writing
    console.log("File written:", filePath);

    return res.status(201).json({ message: "Updated document" });
  }
};

const singleEmployeeDocument = async (req, res) => {
  //
  const { id, userId } = req.params;

  const employeeDocument = await EmployeeDocument.findOne({
    where: {
      userId,
      documentId: id,
    },
  });

  // If employee is not found, return a 404 status code
  if (!employeeDocument) {
    return res.status(404).json({ error: "Employee Document not found" });
  }

  // If employeeDocument is found, return the employeeDocument data including associated documents
  return res.json(employeeDocument);
};

const singleEmployee = async (req, res) => {
  const { id } = req.user.employee;
  try {
    // Use Sequelize to find the employee with the specified ID and include associated documents
    const employee = await Employee.findOne({
      where: { id },
      include: [{ model: EmployeeDocument }],
    });

    const employeeDepartment = await EmployeeDepartment.findOne({
      where: {
        userId: id,
      },
    });

    // // If employee is not found, return a 404 status code
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If employee is found, return the employee data including associated documents
    return res.status(200).json({ employee, employeeDepartment });
  } catch (error) {
    // If an error occurs, return a 500 status code and the error message
    console.error("Failed to fetch employee:", error);
    return res.status(500).json({ error: "Failed to fetch employee" });
  }
};

const getApproverSingleEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    // Use Sequelize to find the employee with the specified ID and include associated documents
    const employee = await Employee.findOne({
      where: { id },
      include: [{ model: EmployeeDocument }],
    });

    // If employee is not found, return a 404 status code
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If employee is found, return the employee data including associated documents
    return res.json(employee);
  } catch (error) {
    // If an error occurs, return a 500 status code and the error message
    console.error("Failed to fetch employee:", error);
    return res.status(500).json({ error: "Failed to fetch employee" });
  }
};

const createDocument = async (req, res) => {
  try {
    // Extract document data from request body
    const { documentTag, documentName, requireVerification } = req.body;

    // check existing document name

    const existingDocument = await Document.findOne({
      where: { documentName },
    });

    if (existingDocument) {
      return res.status(400).json({ error: "Document name already exists" });
    }

    // Create a new document record in the database
    const newDocument = await Document.create({
      documentTag,
      documentName,
      requireVerification,
    });

    // Send a success response with the created document data
    res.status(201).json(newDocument);
  } catch (error) {
    // Handle any errors that occur during document creation
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Failed to create document" });
  }
};

const createEmployee = async (req, res) => {
  try {
    // Extract employee data from the request body
    const {
      surname,
      firstName,
      middleName,
      residentialAddress,
      city,
      state,
      gender,
      dateOfBirth,
      maidenName,
      maritalStatus,
      dependants,
      homeStatus,
      stateOfOrigin,
      homeTown,
      religion,
      nationality,
      lga,
      countryOfBirth,
      altEmailAddress,
      mobileNumber,
      alternateNumber,
      disabilities,
      height,
      weight,
      languages,
      hobbies,
      formId,
      issuerOfId,
      townIssued,
      idNumber,
      dateIssued,
      expiryDate,
      nextOfKin,
      nextOfKinAddress,
      nextOfKinMobileNumber,
      relationship,
      bvn,
      pfa,
      pensionNumber,
      nhfNumber,
      employmentDate,
      // Add all other employee fields here
    } = req.body;

    const formattedDateOfBirth = dateOfBirth.split("-").reverse().join("-"); // Convert '26-08-1990' to '1990-08-26'

    // Create a new employee record in the database
    const newEmployee = await Employee.update({
      surname,
      firstName,
      middleName,
      residentialAddress,
      city,
      state,
      gender,
      dateOfBirth,
      maidenName,
      maritalStatus,
      dependants,
      homeStatus,
      stateOfOrigin,
      homeTown,
      religion,
      nationality,
      lga,
      countryOfBirth,
      altEmailAddress,
      mobileNumber,
      alternateNumber,
      disabilities,
      height,
      weight,
      languages,
      hobbies,
      formId,
      issuerOfId,
      townIssued,
      idNumber,
      dateIssued,
      expiryDate,
      nextOfKin,
      nextOfKinAddress,
      nextOfKinMobileNumber,
      relationship,
      bvn,
      pfa,
      pensionNumber,
      nhfNumber,
      employmentDate,
      employeeOnboardingStatus: "review",
    });

    // Extract uploaded files
    const files = req.files.files;

    // Create a directory path for the employee's uploads
    const uploadDir = path.join(
      __dirname,
      "..",
      "uploads",
      `${surname.toUpperCase()} ${firstName.toUpperCase()}`
    );

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create documents for the employee
    const createdDocuments = await Promise.all(
      files.map(async (file) => {
        // Create a directory path for the document type
        const documentDir = path.join(uploadDir, file.name.toUpperCase());

        // Create the document type directory if it doesn't exist
        if (!fs.existsSync(documentDir)) {
          fs.mkdirSync(documentDir, { recursive: true });
        }

        const document = await Document.findOne({
          where: {
            documentTag: file.name,
          },
        });

        const fileName = `${firstName.toLowerCase()}_${file.name
          .split(" ")
          .join("_")}.${file.mimetype.split("/")[1]}`;

        // Define the file path
        const filePath = path.join(documentDir, fileName);

        // Write the file to the specified path
        fs.writeFileSync(filePath, file.data);

        // Process the uploaded file and create a new document record in the database
        const createdDoc = await EmployeeDocument.create({
          userId: newEmployee.id, // Associate the document with the newly created employee
          documentName: fileName,
          documentType: file.mimetype,
          documentId: document.documentId,
          documentPath: filePath, // Save the file path in the document record
        });
        return createdDoc;
      })
    );

    // const createdDocuments = [];

    // Send a success response with the created employee data and documents
    res.status(201).json({ newEmployee, createdDocuments });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error("Failed to create employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
};

const deleteDocument = async (req, res) => {
  try {
    // Extract document ID from request parameters
    const { id } = req.params;

    // Find the document by ID
    const document = await Document.findByPk(id);

    // If the document doesn't exist, return a 404 (Not Found) response
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete the document from the database
    await document.destroy();

    // Send a success response
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during document deletion
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

const uploadExcelSpreadSheet = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const file = req.files.file;

  if (
    file.mimetype !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid file format, Accepted file is .xlsx" });
  }

  try {
    const workbook = XLSX.read(file.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const newEmployees = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Generate password for new hire
    const userWithPassword = newEmployees.map((each) => {
      const newEmployeePassword = generatePassword();
      return {
        ...each,
        password: newEmployeePassword,
      };
    });

    // Send user mail
    userWithPassword.forEach(async (user) => {
      await sendMessage(user.email, user.name, user.password);
    });

    res.status(200).json({
      message: "Employee created successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateEmployeeProfile = async (req, res) => {
  try {
    // Extract updated documents from request body
    const { updatedDocuments, departmentInfo } = req.body;

    const { userId } = req.params;

    const employee = await Employee.findOne({ where: { id: userId } });

    if (departmentInfo) {
      const {
        nameOfLineManager,
        branch,
        nameOfDepartment,
        gradeOfEmployee,
        employmentDate,
      } = departmentInfo;

      const employeeDept = await EmployeeDepartment.findOne({
        where: {
          userId,
        },
      });

      if (employeeDept) {
        await employeeDept.update({
          userId,
          nameOfLineManager,
          branch,
          nameOfDepartment,
          gradeOfEmployee,
          employmentDate,
        });
      } else {
        await EmployeeDepartment.create({
          userId,
          nameOfLineManager,
          branch,
          nameOfDepartment,
          gradeOfEmployee,
          employmentDate,
        });
      }
    }

    // Validate if updatedDocuments array is provided
    if (updatedDocuments && !Array.isArray(updatedDocuments)) {
      return res
        .status(400)
        .json({ error: "Invalid or empty 'updatedDocuments' array" });
    }

    if (updatedDocuments && updatedDocuments.length > 0) {
      // Extract document IDs from updated documents
      const documentIds = updatedDocuments.map((doc) => doc.documentId);

      // Fetch existing employee documents from the database based on the document IDs
      const employeeDocuments = await EmployeeDocument.findAll({
        where: {
          userId,
          documentId: documentIds, // Filter by document IDs
        },
      });

      // Update each employee document with the corresponding data from updatedDocuments array
      await Promise.all(
        updatedDocuments.map(async (updatedDoc) => {
          const employeeDoc = employeeDocuments.find(
            (doc) => doc.documentId === updatedDoc.documentId
          );
          if (employeeDoc) {
            // Update document status and review
            await employeeDoc.update({
              documentStatus: updatedDoc.documentStatus,
              documentReview: updatedDoc.documentReview,
            });
          }
        })
      );
    }

    if (employee) {
      if (employee.employee_onboarding_status === "review")
        await employee.update({
          employee_onboarding_status: "approver",
        });
    }

    // Return success message
    return res
      .status(200)
      .json({ message: "Employee profile updated successfully" });
  } catch (error) {
    // If an error occurs, return a 500 status code and the error message
    console.error("Failed to update documents:", error);
    return res.status(500).json({ error: "Failed to update documents" });
  }
};

const previewEmployeeDocument = async (req, res) => {
  try {
    const { documentId, userId } = req.params;

    // Fetch the document details from the database based on documentId
    const document = await EmployeeDocument.findOne({
      where: {
        userId,
        documentId,
      },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Get the path to the PDF file
    const filePath = document.documentPath;

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Read the PDF file and send it as a response
    const fileStream = fs.createReadStream(filePath);

    // Set the filename as a response header
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.documentName}"`
    );

    // Send the file stream as response
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error sending document preview:", error);
    res.status(500).json({ error: "Failed to send document preview" });
  }
};

const approveEmployeeProfile = async (req, res) => {
  // Extract updated documents from request body
  const { updatedDocuments, employee_review, approver_status } = req.body;

  const { userId } = req.params;

  try {
    const employee = await Employee.findOne({ where: { id: userId } });

    // Validate if updatedDocuments array is provided
    if (updatedDocuments && !Array.isArray(updatedDocuments)) {
      return res
        .status(400)
        .json({ error: "Invalid or empty 'updatedDocuments' array" });
    }

    if (updatedDocuments && updatedDocuments.length > 0) {
      // Extract document IDs from updated documents
      const documentIds = updatedDocuments.map((doc) => doc.documentId);

      // Fetch existing employee documents from the database based on the document IDs
      const employeeDocuments = await EmployeeDocument.findAll({
        where: {
          userId,
          documentId: documentIds, // Filter by document IDs
        },
      });

      // Update each employee document with the corresponding data from updatedDocuments array
      await Promise.all(
        updatedDocuments.map(async (updatedDoc) => {
          const employeeDoc = employeeDocuments.find(
            (doc) => doc.documentId === updatedDoc.documentId
          );
          if (employeeDoc) {
            // Update document status and review
            await employeeDoc.update({
              documentStatus: updatedDoc.documentStatus,
              documentReview: updatedDoc.documentReview,
            });
          }
        })
      );
    }

    if (employee_review) {
      await employee.update({
        employee_review,
      });
    }

    if (approver_status === "approved") {
      if (employee.employee_onboarding_status === "approver")
        await employee.update({
          employee_onboarding_status: "done",
        });
    }

    if (approver_status === "rejected") {
      await employee.update({
        employee_onboarding_status: "approver",
      });
    }

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  allDocuments,
  allEmployees,
  editDocument,
  updateEmployee,
  createEmployee,
  createDocument,
  singleEmployee,
  deleteDocument,
  updateEmployeeProfile,
  uploadExcelSpreadSheet,
  singleEmployeeDocument,
  previewEmployeeDocument,
  approveEmployeeProfile,
  getApproverSingleEmployee,
};
