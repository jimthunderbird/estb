/**
 * Create all different books based on the data
 */

const createBook = (book) => {
  let content = "";
  for (let i = 1; i <= book.numOfChapters; i ++) {
    const verseFiles = execSync(`find ./data/${book.key}/${i} -type f -name "*.txt"`).toString().trim().split("\n");
    const verseFilesHash = {};
    verseFiles.forEach(verseFile => {
      const key = parseInt(verseFile.split("/").pop().replace(".txt",""));
      verseFilesHash[key] = verseFile;
    });
    Object.keys(verseFilesHash).forEach(key => {
      content += `${i}:${key} ` + fs.readFileSync(verseFilesHash[key]).toString() + "\n";
    });
    content += "\n";
  }
  fs.writeFileSync(`./books/${book.key}.txt`, content);
};

const fs = require('fs');
const execSync = require('child_process').execSync;

const booksChapterCounts = fs.readFileSync('./bible.books.chapter.count').toString().trim()
  .split("\n")
  .map(line => {
    const comps = line.split(':');
    return {
      key: comps[0].trim(),
      numOfChapters: parseInt(comps[1].trim())
    }
  });

booksChapterCounts.forEach(book => createBook(book));
