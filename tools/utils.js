
function replaceGeneratedBlock(content, newCode) {
  const start = "// AUTO-GENERATED START";
  const end = "// AUTO-GENERATED END";
  const regex = new RegExp(start + "[\s\S]*?" + end, "m");
  const block = `${start}\n${newCode}\n${end}`;
  if (regex.test(content)) return content.replace(regex, block);
  return block + "\n" + content;
}
module.exports = { replaceGeneratedBlock };
