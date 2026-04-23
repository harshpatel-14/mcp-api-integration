
function zodFromSchema(schema) {
  if (!schema || !schema.properties) return "z.any()";
  const fields = Object.entries(schema.properties).map(([k, v]) => {
    let t = "z.any()";
    if (v.type === "string") t = "z.string()";
    if (v.type === "number" || v.type === "integer") t = "z.number()";
    if (v.type === "boolean") t = "z.boolean()";
    return `${k}: ${t}`;
  }).join(",\n");
  return `z.object({\n${fields}\n})`;
}
module.exports = { zodFromSchema };
