const fs = require('fs');
const execSync = require('child_process').execSync;

const verseFiles = execSync(`find data -type f -name "*.txt"`).toString().trim().split("\n");
verseFiles.forEach(verseFile => {
  const content = fs.readFileSync(verseFile).toString().trim();
  const lines = content.split("\n");
  lines.shift();
  fs.writeFileSync(verseFile, lines[0]);
});
