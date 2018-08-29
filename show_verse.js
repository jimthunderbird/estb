/**
 * This script will show a speicifc bible verse
 * Usage node show_verse.js genesis 1.2
 */

const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const book = process.argv[2].toLowerCase();
const verse = process.argv[3].replace('.','-');

const verseUrl = `https://www.studylight.org/commentary/${book}/${verse}.html`;

(async () => {
  try {
    const response = await axios.get(verseUrl);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.querySelector(".extra_title").textContent;
    const body = dom.window.document.querySelector(".subtitle").textContent;
    console.log({ title, body });
  } catch(err) {
    console.log(err);
  }
})();
