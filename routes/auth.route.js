const authRoute = require("express").Router();

const controller = require("../controller/auth.controller");
const { verifyToken } = require("../middleware");

authRoute.get("/employee/all", controller.allEmployees);

authRoute.get("/document/all", controller.allDocuments);

authRoute.put("/document/edit/:documentId", controller.editDocument);

authRoute.get(
  "/employee/document/:userId/single/:id",
  controller.singleEmployeeDocument
);

authRoute.get("/employee/approver/:id", controller.getApproverSingleEmployee);

authRoute.get("/employee/single", [verifyToken], controller.singleEmployee);

authRoute.put(
  "/employee/update/document",
  [verifyToken],
  controller.updateEmployee
);

authRoute.get(
  "/employee/document/:documentId/preview/:userId",
  controller.previewEmployeeDocument
);

authRoute.put(
  "/employee/approver/:userId/update",
  controller.updateEmployeeProfile
);

authRoute.post("/document/create", controller.createDocument);

authRoute.post("/employee/create", controller.createEmployee);

authRoute.delete("/document/delete/:id", controller.deleteDocument);

authRoute.put(
  "/employee/profile/approve/:userId",
  controller.approveEmployeeProfile
);

module.exports = authRoute;
