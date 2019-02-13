const path = require('path');
const fs = require('fs-extra');
const markdown = require('markdown-builder');

const BREAK_LINE = '\n';

async function generate({ json, fileName }, targetDir) {
  const { highlights } = json;
  let result = '';

  highlights.forEach(({ content, notes, location }) => {
    let part = '';

    part += '> ' + content + BREAK_LINE;

    if (notes && notes.length) {
      notes.forEach(note => {
        part += BREAK_LINE + note.content + BREAK_LINE;
      });
    }

    result += part + BREAK_LINE;
  });

  return fs.outputFile(path.join(targetDir, `${fileName}.md`), result);
}

module.exports = generate;
