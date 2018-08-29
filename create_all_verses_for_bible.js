/**
 * This script will create all verses for the bible, store them one by one under the data folder
 */

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

const processEntry = async (entry) => {
  for (let i = 1; i <= entry.chapterCount; i ++) {
    const url = `https://www.studylight.org/commentary/${entry.book}/${i}.html`;
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const links = dom.window.document.querySelectorAll('a');
    const verseCount = Math.max(...
      Object.values(links)
      .map(entry => entry.textContent)
      .filter(entry => entry.substring(0,6) === 'Verse ')
      .map(entry => parseInt(entry.replace('Verse', '')))
    );

    if (typeof verseCount === 'number') {
      for (let vc = 1; vc <= verseCount; vc ++) {
        const verseFile = `data/${entry.book}/${i}/${vc}.txt`;
        if (fs.existsSync(verseFile)) {
          continue;
        }
        execSync(`mkdir -p data/${entry.book}/${i}`);
        const verseUrl = `https://www.studylight.org/commentary/${entry.book}/${i}-${vc}.html`;
        axios.get(verseUrl).then(response => {
          const dom = new JSDOM(response.data);
          const title = dom.window.document.querySelector(".extra_title").textContent;
          const body = dom.window.document.querySelector(".subtitle").textContent;
          fs.writeFileSync(verseFile, title + "\n" + body);
          console.log(`Done creating verse ${entry.book}/${i}/${vc}`);
        }).catch(error => {
          // handle error
          fs.appendFileSync(logFile, verseUrl + "\n");
          console.log(error);
        });
      }
    }
  }
};

const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const execSync = require('child_process').execSync;
const { JSDOM } = jsdom;

const logFile = './pending-verse-urls.log';

//first, truncate the log
fs.writeFileSync(logFile, '');

(async () => {
  try {
    const booksChapterCounts = fs.readFileSync('./bible.books.chapter.count').toString().trim()
      .split("\n")
      .map(line => {
        const comps = line.split(':');
        return {
          book: comps[0].trim(),
          chapterCount: parseInt(comps[1].trim())
        }
      }
      );

    booksChapterCounts.forEach(entry => processEntry(entry));
  } catch(err) {
    console.log(err);
  }
})();
