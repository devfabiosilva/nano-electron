const MY_NANO_JS = require('./system/mynanojs-linux-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-linux-1.0-arm7l');
//const MY_NANO_JS = require('./system/mynanojs-win-1.0-ia64');
///const MY_NANO_JS = require('./system/mynanojs-mac-1.0-ia64');

module.exports = {

   commands(req, res) {

      return res.json({ text: MY_NANO_JS.nanojs_license() });
   }

}


