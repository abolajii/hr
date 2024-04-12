const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/auth.route");
const noAuthRoutes = require("./routes/noauth.route");
const cors = require("cors");

const fileUpload = require("express-fileupload");
const { syncModels, Document } = require("./models");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// syncModels();

//routes
app.use("/api", authRoutes);
app.use("/api", noAuthRoutes);

const createDocument = async (data) => {
  // Extract document data from request body
  const { documentTag, documentName, requireVerification } = data;

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

  console.log("created");
};

const data = {
  documentName: "Degree Certificate",
  documentTag: "degree certificate",
  requireVerification: false,
};

// createDocument(data);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
