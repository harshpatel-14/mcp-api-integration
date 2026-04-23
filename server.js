
const express = require("express");
const { generateApi } = require("./tools/generateApi");
const { syncSwagger } = require("./tools/syncSwagger");

const app = express();
app.use(express.json());

app.post("/execute", async (req, res) => {
  const { tool, params } = req.body;
  if (tool === "generateApi") return res.json(await generateApi(params));
  return res.status(400).json({ error: "Unknown tool" });
});

app.post("/sync", async (req, res) => {
  const { swaggerUrl, outputPath } = req.body;
  const result = await syncSwagger({ swaggerUrl, outputPath });
  res.json(result);
});

app.listen(3000, () => console.log("MCP running on 3000"));
