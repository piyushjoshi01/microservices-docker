const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();

app.use(express.json());

const PORT = 6000;

const SECOND_APP_URL = "http://container2:6060";

app.post("/calculator", async (req, res) => {
  const { file, product } = req.body;

  if (!file) {
    res.json({ file: null, error: "Invalid JSON input." });
  } else {
    if (typeof file !== "string" || typeof product !== "string") {
      return res
        .status(400)
        .json({ error: "File and product must be strings" });
    }

    const filePath = `../files/${file}`;

    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        console.error("Error checking file existence:", err);
        return res.status(404).json({ file, error: "File not found." });
      }

      try {
        const response = await axios.post(`${SECOND_APP_URL}/input`, {
          file,
          product,
        });
        if (response.status === 200) {
          res.status(200).json({
            message: "Input sent to the second application successfully",
          });
        } else {
          res.status(response.status).json(response.data);
        }
      } catch (error) {
        console.error("Error sending input to the second application:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
