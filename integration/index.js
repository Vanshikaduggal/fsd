const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required />
      <br /><br />
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <br /><br />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});