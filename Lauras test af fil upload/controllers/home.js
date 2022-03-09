const path = require("path");
const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};
const download = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../views/indhold.html`));
};
module.exports = {
  getHome: home,
    getDownload: download
};