const MY_NANO_JS = require('./system/mynanojs-linux-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-linux-1.0-arm7l');
//const MY_NANO_JS = require('./system/mynanojs-win-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-mac-1.0-ia64');
const MY_NANO_JS_DEFAULT_ERROR = {error: 2, reason: "Missing value"};
const SUCCESS_MESSAGE = "Success";
const COMMAND_ENCRYPTED_STREAM_TO_SEED = 1;
const COMMAND_WALLET_TO_PUBLIC_KEY = 2;
const COMMAND_CONVERT_BALANCE = 3;
const COMMAND_SEED_TO_KEY_PAIR = 4;

function sendDefaultError(err, reason) {
   return {error: err, reason: reason};
}

function verifyError(value) {
   if ((value !== undefined) && (value !== "") && (value !== null))
      return value;

   return false;
}

function stringToArrayBuffer(value) {
   let uint8;
   let buffer;
   let arrayBuffer;

   buffer = Buffer.from(value, 'hex');
   arrayBuffer = new ArrayBuffer(buffer.length);
   uint8 = new Uint8Array(arrayBuffer);
   uint8.set(buffer);

   return arrayBuffer;
}

module.exports = {

    NANO_PREFIX: MY_NANO_JS.NANO_PREFIX,
    XRB_PREFIX: MY_NANO_JS.XRB_PREFIX,
    commands(req, res) {
      let command;
      let tmp1, tmp2, tmp3;
      let result;
      let arrayBuffer;

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

         tmp2 = verifyError(req.body.password);

         if (!tmp2)
            return res.json(sendDefaultError(3, "Missing: Password"));

         arrayBuffer = stringToArrayBuffer(tmp1);

         try {
            result = MY_NANO_JS.nanojs_encrypted_stream_to_seed(arrayBuffer, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, seed: result.seed});

      }

      if (command === COMMAND_WALLET_TO_PUBLIC_KEY) {
/*
req = { command: number, wallet: string }
*/
         tmp1 = verifyError(req.body.wallet);

         if (!tmp1)
            return res.json(sendDefaultError(4, "Missing wallet"));

         try {
            result = MY_NANO_JS.nanojs_wallet_to_public_key(tmp1);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, wallet: tmp1, public_key: result});

      }

      if (command === COMMAND_CONVERT_BALANCE) {
/*
req = { command: number, balance: string, balance_type: number (Optional. If ommited then raw -> real)}
*/
         tmp1 = verifyError(req.body.balance_type);
         if (tmp1)
            switch (tmp1) {
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.REAL_TO_RAW:
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.RAW_TO_REAL:
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.REAL_TO_HEX:
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.HEX_TO_REAL:
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.RAW_TO_HEX:
               case MY_NANO_JS.NANO_BIG_NUMBER_TYPE.HEX_TO_RAW:
                  break;
               default:
                  return res.json(sendDefaultError(5, "Invalid big number conversion"));
            }

         tmp2 = verifyError(req.body.balance);

         if (!tmp2)
            return res.json(sendDefaultError(6, "Missing: Balance"));

         try {
            (tmp1)?(result = MY_NANO_JS.nanojs_convert_balance(tmp2, tmp1)):(result = MY_NANO_JS.nanojs_convert_balance(tmp2));
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, balance: tmp2, converted_balance: result});
      }

      if (command === COMMAND_SEED_TO_KEY_PAIR) {
/*
req = { command: number, seed: string, wallet_number: number, prefix: string (optional)}
*/
         tmp1 = verifyError(req.body.seed);

         if (!tmp1)
            return res.json(sendDefaultError(7, "Missing: SEED"));

         tmp2 = verifyError(req.body.wallet_number);

         if (!tmp2)
            return res.json(sendDefaultError(8, "Missing: Wallet number"));

         tmp3=verifyError(req.body.prefix);

         try {
            (tmp3)?(result = MY_NANO_JS.nanojs_seed_to_keypair(tmp1, tmp2, tmp3)):(result = MY_NANO_JS.nanojs_seed_to_keypair(tmp1, tmp2));
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, key_pair: result});

      }

      return res.json({ error: -2, reason: "Unknown command"});
   }

}

