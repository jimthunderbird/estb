const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const execSync = require('child_process').execSync;
const { JSDOM } = jsdom;

const logFile = './pending-verse-urls.log';

const urls = fs.readFileSync(logFile).toString().trim().split("\n").forEach(url => {
  const urlComps = url.split("/");
  const verse = urlComps.pop().replace("-","/").replace(".html",".txt");
  const book = urlComps.pop();
  const verseFile = `./data/${book}/${verse}`;
  if (! fs.existsSync(verseFile) ) {
    axios.get(url).then(response => {
      const dom = new JSDOM(response.data);
      const title = dom.window.document.querySelector(".extra_title").textContent;
      const body = dom.window.document.querySelector(".subtitle").textContent;
      fs.writeFileSync(verseFile, title + "\n" + body);
      console.log(`Done creating verse ${verseFile}`);
    });
  }
});
