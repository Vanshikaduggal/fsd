const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",        
  password: "@V__anshika132005",   
  database: "ecom",    
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "User registered successfully!" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful!" });
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result); 
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ products: result }); 
  });
});

app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventory";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching inventory:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result); 
  });
});

app.post("/add-product", (req, res) => {
  const { name, price, description } = req.body;

  const sql = "INSERT INTO products (name, price, description) VALUES (?, ?, ?)";
  db.query(sql, [name, price, description], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Product added successfully!" });
  });
});

const upload = multer({ dest: "uploads/" });

app.post("/upload-inventory", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    data.forEach((row) => {
      const { name, quantity, price } = row;

      const sql = "INSERT INTO inventory (name, price, quantity) VALUES (?, ?, ?)";
      db.query(sql, [name, price, quantity], (err) => {
        if (err) {
          console.error("Error inserting inventory:", err);
        }
      });
    });
    fs.unlinkSync(file.path);

    res.json({ message: "Inventory uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});