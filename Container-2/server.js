const express = require("express");
const fs = require("fs");

function isValidCSVLine(line) {
  return line.includes(",");
}

const csv = require("csv-parser");
const { error } = require("console");

const app = express();

app.use(express.json());

const PORT = 6060;

app.post("/input", (req, res) => {
  const { file, product } = req.body;

  const filePath = `../files/${file}`;

  const data = [];

  fs.readFile(filePath, "utf8", (err, datData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).json({ file, error: "File not found." });
    }
    const lines = datData.trim().split("\n");

    const allLinesAreValid = lines.every(isValidCSVLine);

    if (!allLinesAreValid) {
      return res
        .status(400)
        .json({ file, error: "Input file not in CSV format." });
    }

    lines
      .map((line) => line.split(","))
      .forEach((row) => {
        const [product, price] = row;
        data.push({ product, price });
      });

    let count = 0;

    data.forEach((item) => {
      if (item.product === product) {
        count += parseInt(item.price);
      }
    });
    res.status(201).json({ file, sum: count });
  });

  console.log("Received data from Application 1:", { file, product });
});

app.listen(PORT, () => {
  console.log("SERVER AT 6060 STARTED");
});
