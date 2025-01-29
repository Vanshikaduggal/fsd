const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@V__anshika132005",
    database: "fsd",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database");
});


app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});


app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).send("Registration failed");
        }
        res.redirect("/dashboard");
    });
});


app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).send("Login failed");
        }

        if (results.length > 0) {
            res.redirect("/dashboard");
        } else {
            res.status(401).send("Invalid credentials");
        }
    });
});

// Serve dashboard with users
app.get("/dashboard", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).send("Failed to load dashboard");
        }

        let tableRows = results
            .map(
                (user, index) =>
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${"*".repeat(user.password.length)}</td>
                        <td class="action-buttons">
                            <button class="edit" onclick="editUser(${user.id})">Edit</button>
                            <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    </tr>`
            )
            .join("");

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard</title>
                <link rel="stylesheet" href="/dashboard.css">
            </head>
            <body>
                <div class="dashboard">
                    <h1>User Dashboard</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
                <script>
                    function editUser(id) {
                        alert("Edit functionality is under development for user ID " + id);
                    }

                    function deleteUser(id) {
                        fetch('/delete/' + id, { method: 'DELETE' })
                            .then(() => window.location.reload())
                            .catch(err => console.error('Error deleting user:', err));
                    }
                </script>
            </body>
            </html>
        `;
        res.send(html);
    });
});


app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Failed to delete user");
        }
        res.status(200).send("User deleted successfully");
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});