const fs = require("fs");

const icons = fs.readdirSync('utils/icons').filter(file => file.endsWith('.png'));

let iconFiles = {};
icons.forEach(file => {
    iconFiles[file.split(".")[0]] = `${file}`;
})

module.exports = iconFiles;