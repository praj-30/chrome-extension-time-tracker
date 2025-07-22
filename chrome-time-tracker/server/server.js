const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const path = './data.json';

app.use(cors());
app.use(express.json());

// Save time entry
app.post('/save', (req, res) => {
  const entry = req.body;
  let data = [];

  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  data.push(entry);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.send("✅ Data saved");
});

// Get report
app.get('/report', (req, res) => {
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path));
    res.json(data);
  } else {
    res.json([]);
  }
});

// Run server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
