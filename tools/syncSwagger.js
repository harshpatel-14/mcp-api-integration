
const SwaggerParser = require("@apidevtools/swagger-parser");
const fs = require("fs-extra");
const path = require("path");
const { diff } = require("json-diff");
const { generateApi } = require("./generateApi");

async function syncSwagger({ swaggerUrl, outputPath }) {
  const newSwagger = await SwaggerParser.dereference(swaggerUrl);
  const cachePath = path.join(outputPath, "..", "swagger-cache.json");

  let oldSwagger = {};
  if (await fs.pathExists(cachePath)) {
    oldSwagger = await fs.readJson(cachePath);
  }

  const changes = diff(oldSwagger.paths || {}, newSwagger.paths || {}) || {};
  const breaking = [];

  const serialized = JSON.stringify(changes);
  if (serialized.includes("type") || serialized.includes("required")) {
    breaking.push("Potential breaking schema changes detected");
  }

  if (breaking.length) {
    return { breakingChanges: breaking };
  }

  await generateApi({ swaggerUrl, outputPath });
  return { success: true, message: "Updated safely" };
}

module.exports = { syncSwagger };
