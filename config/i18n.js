const i18n = require("i18n");
const path = require("path");
const config = require("../config/config");
i18n.configure({
    locales: ["en", "vi"],
    defaultLocale: config.defaultLocale,
    directory: path.join("./", "resources/lang"),
    cookie: 'lang'
});
module.exports = i18n;
