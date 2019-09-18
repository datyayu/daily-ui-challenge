const fs = require("fs");
const path = require("path");

/*************
 *   Config   *
 *************/

const CHALLENGES_DIR_NAME = "challenges";
const DESIGN_FOLDER_NAME = "design";
const MOCKUP_FOLDER_NAME = "mockup";

// File paths
const indexTemplateFilePath = path.join(__dirname, "index.template.html");
const indexFilePath = path.join(__dirname, "..", "index.html");
const challengesDir = path.join(__dirname, "..", CHALLENGES_DIR_NAME);

/*************
 *   UTILS   *
 *************/

function getImagePath(dirname) {
  const desginDir = path.join(challengesDir, dirname, DESIGN_FOLDER_NAME);
  const filesInDirectory = fs.readdirSync(desginDir);

  const imagePath = filesInDirectory.find(file => file.endsWith(".png"));

  if (!imagePath) {
    return null;
  }

  return `./${CHALLENGES_DIR_NAME}/${dirname}/${DESIGN_FOLDER_NAME}/${imagePath}`;
}

function getMockupPath(dirname) {
  const mockupFilePath = path.join(
    challengesDir,
    dirname,
    MOCKUP_FOLDER_NAME,
    "index.html"
  );
  const isMockupCreated = fs.existsSync(mockupFilePath);

  if (!isMockupCreated) {
    return null;
  }

  return `./${CHALLENGES_DIR_NAME}/${dirname}/${MOCKUP_FOLDER_NAME}/index.html`;
}

function generateEntryDataFromDirname(dirname) {
  const name = "Challenge " + dirname.replace(/\-/, ": ").replace(/\-/gi, " ");
  const designPath = getImagePath(dirname);
  const mockupPath = getMockupPath(dirname);

  return {
    name,
    designPath,
    mockupPath
  };
}

function generateHTMLListItemForEntry(entry) {
  const entryData = generateEntryDataFromDirname(entry);

  return `
    <li>
      <span>${entryData.name}</span>
      ${
        entryData.designPath
          ? `- <a href="${entryData.designPath}" target="_blank">Design</a>`
          : ""
      }
      ${
        entryData.mockupPath
          ? `/ <a href="${entryData.mockupPath}" target="_blank">Mockup</a>`
          : ""
      }
    </li>
  `;
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return `${year}.${month}.${day}`;
}

/********************
 *   MAIN PROGRAM   *
 ********************/

// Generate entries list
console.log("(INDEX SCRIPT) [1/3] Reading challenge's data.");
const challengesDirEntries = fs.readdirSync(challengesDir);
const entriesTemplates = challengesDirEntries.map(entry =>
  generateHTMLListItemForEntry(entry)
);
const entriesListTemplate = entriesTemplates.join("");

// Get current date
const formattedDate = formatDate(new Date());

// Fill template to file
console.log("(INDEX SCRIPT) [2/3] Filling template with data.");
const indexTemplateFile = fs.readFileSync(indexTemplateFilePath, {
  encoding: "utf8"
});

const updatedTemplate = indexTemplateFile
  .replace("{ENTRIES}", entriesListTemplate)
  .replace("{LAST_UPDATE}", formattedDate);

// Write template to index.html file.
console.log("(INDEX SCRIPT) [3/3] Writing template to index.html.");
fs.writeFileSync(indexFilePath, updatedTemplate);

console.log("(INDEX SCRIPT) index.html generated succesfully!");
