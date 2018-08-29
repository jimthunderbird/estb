/**
 * This will list the chaper and verse index
 */

const axios = require('axios');
const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

const bible = JSON.parse(fs.readFileSync('./bible.json').toString());

Object.keys(bible).forEach(testament => {
  bible[testament].forEach(book => {
    const bookUrl = `https://www.studylight.org/commentary/${book}.html`;
    (async () => {
      try {
        const response = await axios.get(bookUrl);
        const dom = new JSDOM(response.data);
        const links = dom.window.document.querySelectorAll('a');
        const chapterCount = Math.max(...
          Object.values(links)
          .map(entry => entry.textContent)
          .filter(entry => entry.substring(0,7) === 'Chapter')
          .map(entry => parseInt(entry.replace('Chapter ', '')))
        );
        console.log(`${book}: ${chapterCount}`);
      } catch(err) {
        console.log(err);
      }
    })();
  });
});
