
const fs = require("fs");
const path = require("path");

const root = __dirname;

const folders = [
  "backend/config",
  "backend/controllers",
  "backend/models",
  "backend/routes",
  "backend/middleware",
  "backend/utils",

  "frontend/public",
  "frontend/src/assets",
  "frontend/src/components",
  "frontend/src/pages",
  "frontend/src/context",
  "frontend/src/utils",
];

const files = [
  // Backend
  "backend/config/db.js",

  "backend/controllers/authController.js",
  "backend/controllers/collectorController.js",
  "backend/controllers/recyclerController.js",
  "backend/controllers/adminController.js",

  "backend/models/User.js",
  "backend/models/Listing.js",
  "backend/models/Quote.js",
  "backend/models/Transaction.js",

  "backend/routes/authRoutes.js",
  "backend/routes/collectorRoutes.js",
  "backend/routes/recyclerRoutes.js",
  "backend/routes/adminRoutes.js",

  "backend/middleware/authMiddleware.js",
  "backend/middleware/roleMiddleware.js",

  "backend/utils/emailSender.js",

  "backend/.env",
  "backend/.gitignore",
  "backend/server.js",

  // Frontend components
  "frontend/src/components/Navbar.jsx",
  "frontend/src/components/Footer.jsx",
  "frontend/src/components/ProtectedRoute.jsx",

  // Frontend pages
  "frontend/src/pages/Home.jsx",
  "frontend/src/pages/Login.jsx",
  "frontend/src/pages/Register.jsx",
  "frontend/src/pages/CollectorDashboard.jsx",
  "frontend/src/pages/RecyclerDashboard.jsx",
  "frontend/src/pages/AdminDashboard.jsx",

  // Frontend context and utilities
  "frontend/src/context/AuthContext.jsx",
  "frontend/src/utils/api.js",

  // Frontend entry files
  "frontend/src/App.jsx",
  "frontend/src/main.jsx",
  "frontend/src/index.css",

  "frontend/.env",
  "frontend/.gitignore",
  "frontend/index.html",
  "frontend/vite.config.js",

  // Root files
  "README.md",
];

// Valid starter package.json files
const packageFiles = {
  "backend/package.json": {
    name: "kabadiwala-connect-backend",
    version: "1.0.0",
    private: true,
    main: "server.js",
    scripts: {
      start: "node server.js",
      dev: "nodemon server.js",
    },
  },

  "frontend/package.json": {
    name: "kabadiwala-connect-frontend",
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
  },
};

let createdFolders = 0;
let createdFiles = 0;
let skippedItems = 0;

function createFolder(relativePath) {
  const fullPath = path.join(root, relativePath);

  if (fs.existsSync(fullPath)) {
    skippedItems++;
    return;
  }

  fs.mkdirSync(fullPath, { recursive: true });
  createdFolders++;
  console.log("📁 Folder:", relativePath);
}

function createFile(relativePath, content = "") {
  const fullPath = path.join(root, relativePath);

  // Never overwrite an existing file.
  if (fs.existsSync(fullPath)) {
    skippedItems++;
    console.log("⏭️ Already exists:", relativePath);
    return;
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  // wx ensures that existing files are never overwritten.
  const data = typeof content === "string"
    ? content
    : JSON.stringify(content, null, 2) + "\n";

  try {
    fs.writeFileSync(fullPath, data, { flag: "wx" });
    createdFiles++;
    console.log("📄 File:", relativePath);
  } catch (error) {
    if (error.code === "EEXIST") {
      skippedItems++;
      console.log("⏭️ Already exists:", relativePath);
    } else {
      throw error;
    }
  }
}

try {
  console.log("\n🚀 Setting up Kabadiwala Connect...\n");

  for (const folder of folders) {
    createFolder(folder);
  }

  for (const file of files) {
    createFile(file);
  }

  for (const [file, content] of Object.entries(packageFiles)) {
    createFile(file, content);
  }

  console.log("\n✅ Project structure setup complete!");
  console.log(`📁 Folders created: ${createdFolders}`);
  console.log(`📄 Files created: ${createdFiles}`);
  console.log(`⏭️ Existing items skipped: ${skippedItems}`);

  console.log("\n⚠️ Files are empty placeholders except package.json.");
  console.log("Next step: install dependencies and implement the code.");
} catch (error) {
  console.error("\n❌ Setup failed:", error.message);
  process.exitCode = 1;
}
