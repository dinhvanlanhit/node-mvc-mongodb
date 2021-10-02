const i18n = require('i18n')
const path = require('path')
i18n.configure({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  directory: path.join('./', 'resources/lang'),
});
module.exports = i18n;