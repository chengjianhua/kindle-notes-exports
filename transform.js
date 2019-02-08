const path = require('path');
const fs = require('fs-extra');
// const transformEmailToJson = require('kindle-email-to-json');

const JsonConverter = require('./converters/json');

const notesDir = path.resolve('./notes');
const jsonDir = path.resolve('./json');
const markdownDir = path.resolve('./markdown');

run().catch(error => {
  console.error(error);
});

async function run() {
  const emailFiles = await fs.readdir('./notes');

  const emails = await Promise.all(
    emailFiles.map(async f => {
      const emailFilePath = path.join(notesDir, f);
      const emailContent = await fs.readFile(emailFilePath, 'utf-8');

      const emailJson = await convertNoteToJson(emailContent);

      return {
        fileName: f.replace(path.extname(f), ''),
        content: emailContent,
        json: emailJson,
      };
    }),
  );

  await Promise.all([
    ...emails.map(genJson),
    // ...emails.map(genMarkdown),
  ]);
}

function convertNoteToJson(contents) {
  const converter = new JsonConverter(contents);

  if (converter.valid) {
    return converter.getJSON();
  }

  return new Error(
    'Invalid mail content. Expected an HTML attachment with Kindle notes.',
  );
}

async function genJson({ fileName, json }) {
  return fs.outputJson(path.join(jsonDir, `${fileName}.json`), json, {
    spaces: 2,
  });
}

async function genMarkdown({ fileName, json }) {
  return fs.outputFile(path.join(markdownDir, `${fileName}.md`));
}
