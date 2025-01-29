var mysql = require('mysql2');
var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "@V__anshika132005",
    database: "fsd"
});

con.connect(function(err){
    if(err) throw err;
    var sql = "INSERT INTO customers (name, address) VALUES ('Chitkara', 'Rajpura')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    console.log("Connected");
});