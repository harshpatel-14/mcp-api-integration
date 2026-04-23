
const SwaggerParser = require("@apidevtools/swagger-parser");
const fs = require("fs-extra");
const path = require("path");
const { camelCase, pascalCase } = require("change-case");
const { zodFromSchema } = require("./zodGen");

async function generateApi({ swaggerUrl, outputPath }) {
  const api = await SwaggerParser.dereference(swaggerUrl);

  for (const route in api.paths) {
    const methods = api.paths[route];

    for (const method in methods) {
      const op = methods[method];
      const name = camelCase(op.operationId || `${method}_${route}`);
      const typeName = pascalCase(name);

      const service = `
import { apiClient } from "../client";
export const ${name} = async (params) => {
  const res = await apiClient.${method}("${route}", params);
  return res.data;
};`;

      const hook = method === "get" ? `
import { useQuery } from "@tanstack/react-query";
import { ${name} } from "../services/${name}";
import { ${typeName}Schema } from "../types/${name}";

export const use${typeName} = (params) => {
  return useQuery({
    queryKey: ["${name}", params],
    queryFn: async () => {
      const data = await ${name}(params);
      const parsed = ${typeName}Schema.safeParse(data);
      if (!parsed.success) throw new Error("Invalid API response");
      return parsed.data;
    }
  });
};` : `
import { useMutation } from "@tanstack/react-query";
import { ${name} } from "../services/${name}";
export const use${typeName} = () => useMutation({ mutationFn: ${name} });`;

      const schema = zodFromSchema(op.responses?.["200"]?.content?.["application/json"]?.schema);

      const types = `
import { z } from "zod";
export const ${typeName}Schema = ${schema};
export type ${typeName} = z.infer<typeof ${typeName}Schema};`;

      await fs.outputFile(path.join(outputPath, "services", `${name}.ts`), wrap(service));
      await fs.outputFile(path.join(outputPath, "hooks", `use${typeName}.ts`), wrap(hook));
      await fs.outputFile(path.join(outputPath, "types", `${name}.ts`), wrap(types));
    }
  }

  await fs.outputJson(path.join(outputPath, "..", "swagger-cache.json"), api);
  return { success: true };
}

function wrap(code){
  return `// AUTO-GENERATED START
${code}
// AUTO-GENERATED END

// CUSTOM START
// CUSTOM END
`;
}

module.exports = { generateApi };
