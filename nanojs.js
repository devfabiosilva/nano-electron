const MY_NANO_JS = require('./system/mynanojs-linux-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-linux-1.0-arm7l');
//const MY_NANO_JS = require('./system/mynanojs-win-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-mac-1.0-ia64');
const MY_NANO_JS_DEFAULT_ERROR = {error: 2, reason: "Missing value"};
const SUCCESS_MESSAGE = "Success";
const COMMAND_ENCRYPTED_STREAM_TO_SEED = 1;

function sendDefaultError(err, reason) {
   return {error: err, reason: reason};
}

function verifyError(value) {
   if ((value !== undefined) && (value !== "") && (value !== null))
      return value;

   return false;
}

module.exports = {

    commands(req, res) {
      let command;
      let uint8;
      let buffer;
      let arrayBuffer;
      let tmp1, tmp2, tmp3;
      let result;

      command = verifyError(req.body.command);

      if (!command)
         return res.json(sendDefaultError(1, "Missing command"));

      if (command === COMMAND_ENCRYPTED_STREAM_TO_SEED) {
/*
 req = { command: number, encrypted_stream: string, password: string }
*/
         tmp1 = verifyError(req.body.encrypted_stream);

         if (!tmp1)
            return res.json(sendDefaultError(2, "Missing: Encrypted stream"));

         buffer = Buffer.from(tmp1, 'hex');
         arrayBuffer = new ArrayBuffer(buffer.length);
         uint8 = new Uint8Array(arrayBuffer);
         uint8.set(buffer);

         tmp2 = verifyError(req.body.password);

         if (!tmp2)
            return res.json(sendDefaultError(3, "Missing: Password"));

         try {
            result = MY_NANO_JS.nanojs_encrypted_stream_to_seed(arrayBuffer, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, seed: result.seed});

      }
      
      return res.json({ error: -2, reason: "Unknown command"});
   }

}

