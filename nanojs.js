const MY_NANO_JS = require('./system/mynanojs-linux-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-linux-1.0-arm7l');
//const MY_NANO_JS = require('./system/mynanojs-win-1.0-ia64');
//const MY_NANO_JS = require('./system/mynanojs-mac-1.0-ia64');
//const MY_NANO_JS_DEFAULT_ERROR = {error: 2, reason: "Missing value"};
const SUCCESS_MESSAGE = "Success";
const COMMAND_ENCRYPTED_STREAM_TO_SEED = 1;
const COMMAND_WALLET_TO_PUBLIC_KEY = 2;
const COMMAND_CONVERT_BALANCE = 3;
const COMMAND_SEED_TO_KEY_PAIR = 4;
const COMMAND_ENCRYPTED_STREAM_TO_KEY_PAIR = 5;
const COMMAND_PUBLIC_KEY_TO_WALLET = 6;
const COMMAND_BRAINWALLET = 7;
const COMMAND_GEN_SEED_TO_ENCRYPTED_STREAM = 8;
const COMMAND_BIP39_TO_ENCRYPETED_STREAM = 9;
const COMMAND_COMPARE = 10;
const COMMAND_SEED_TO_ENCRYPTED_STREAM = 11;
const COMMAND_VERIFY_SIGNATURE = 12;
const COMMAND_SIGN_MESSAGE = 13;
const MY_NANO_JS_VERIFY_SIG_HASH = "hash";
const MY_NANO_JS_VERIFY_SIG_MSG = "msg";

function sendDefaultError(err, reason) {
   return {error: err, reason: reason};
}

function verifyError(value) {
   if ((value !== undefined) && (value !== "") && (value !== null))
      return value;

   return false;
}

function stringToArrayBuffer(value, type) {
   let uint8;
   let buffer;
   let arrayBuffer;

   if (type)
      buffer = Buffer.from(value, type);
   else
      buffer = Buffer.from(value);
   arrayBuffer = new ArrayBuffer(buffer.length);
   uint8 = new Uint8Array(arrayBuffer);
   uint8.set(buffer);

   return arrayBuffer;
}

module.exports = {

    commands(req, res) {
      let command;
      let tmp1, tmp2, tmp3, tmp4, tmp5;
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

         arrayBuffer = stringToArrayBuffer(tmp1, 'hex');

         try {
            result = MY_NANO_JS.nanojs_encrypted_stream_to_seed(arrayBuffer, tmp2, 'dictionary.dic');
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, result: result});

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
//
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

         if (tmp2 === false)
            return res.json(sendDefaultError(8, "Missing: Wallet number"));

         tmp3=verifyError(req.body.prefix);

         try {
            (tmp3)?(result = MY_NANO_JS.nanojs_seed_to_keypair(tmp1, tmp2, tmp3)):(result = MY_NANO_JS.nanojs_seed_to_keypair(tmp1, tmp2));
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, key_pair: result});

      }

      if (command === COMMAND_ENCRYPTED_STREAM_TO_KEY_PAIR) {
/*
req = { command: number, encrypted_block: string, wallet_number: number, password: string, prefix: string(optional) }
*/
         tmp1 = verifyError(req.body.encrypted_block);

         if (!tmp1)
            return res.json(sendDefaultError(9, "Missing: Encrypted block"));

         tmp1=stringToArrayBuffer(tmp1, 'hex');

         tmp2 = verifyError(req.body.wallet_number);

         if (tmp2 === false)
            return res.json(sendDefaultError(10, "Missing: Wallet Number"));

         tmp3 = verifyError(req.body.password);

         if (!tmp3)
            return res.json(sendDefaultError(11, "Missing: Password"));
         
         tmp4 = verifyError(req.body.prefix);

         try {
            (tmp4)?(result = MY_NANO_JS.nanojs_encrypted_stream_to_key_pair(tmp1, tmp3, tmp2, tmp4)):(result = MY_NANO_JS.nanojs_encrypted_stream_to_key_pair(tmp1, tmp3, tmp2));
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, key_pair: result});

      }

      if (command === COMMAND_PUBLIC_KEY_TO_WALLET) {

/*
 req={public_key: string, prefix: string(optional)}
*/
         tmp1 = verifyError(req.body.public_key);

         if (tmp1 === false)
            return res.json(sendDefaultError(12, "Missing public key"));

         tmp2 = verifyError(req.body.prefix);

         try {
            (tmp2)?(result = MY_NANO_JS.nanojs_public_key_to_wallet(tmp1, tmp2)):(result = MY_NANO_JS.nanojs_public_key_to_wallet(tmp1));
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, wallet: result, public_key: tmp1});

      }

      if (command === COMMAND_BRAINWALLET) {
/*
 req = {text: string, salt: string}
*/
         tmp1 = verifyError(req.body.text);

         if (!tmp1)
            return res.json(sendDefaultError(13, "Missing brainwallet text"));

         tmp2 = verifyError(req.body.salt);

         if (!tmp2)
            return res.json(sendDefaultError(14, "Missing salt"));

         try {
            result = MY_NANO_JS.nanojs_extract_seed_from_brainwallet(tmp1, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({
             error: 0,
             reason: SUCCESS_MESSAGE,
             text: tmp1,
             salt: tmp2,
             extracted: {
                result: {
                   seed: result.seed
                },
                warning_msg: result.warning_message
             }});

      }

      if (command === COMMAND_GEN_SEED_TO_ENCRYPTED_STREAM) {
/*
 req = {entropy: number, password: string}
*/
         tmp1 = verifyError(req.body.entropy);

         if (tmp1 === false)
            return res.json(sendDefaultError(15, "Missing entropy value"));

         tmp2 = verifyError(req.body.password);

         if (tmp2 === false)
            return res.json(sendDefaultError(16, "Missing password"));

         try {
            result = MY_NANO_JS.nanojs_gen_seed_to_encrypted_stream(tmp1, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, encrypted_seed: Buffer.from(result).toString('hex')});
      }

      if (command === COMMAND_COMPARE) {
/*
 req = {valuea: string, typea: string, valueb: string, typeb: string, condition: string}
*/
         tmp1 = verifyError(req.body.value_a);

         if (!tmp1)
            return res.json(sendDefaultError(17, "Missing A value"));

         tmp2 = verifyError(req.body.value_b);

         if (!tmp2)
            return res.json(sendDefaultError(18, "Missing B value"));

         tmp3 = verifyError(req.body.type_a);

         if (!tmp3)
            return res.json(sendDefaultError(19, "Invalid/Unknown A big number type"));

         switch (tmp3) {
            case "real":
               tmp3 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_A_REAL_STRING;
               break;
            case "raw":
               tmp3 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_A_RAW_STRING;
               break;
            case "hex":
               tmp3 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_A_RAW_128;
               break;
            default:
               return res.json(sendDefaultError(22, `Invalid A type value: ${tmp3}`));
         }

         tmp4 = verifyError(req.body.type_b);

         if (!tmp4)
            return res.json(sendDefaultError(21, "Invalid/Unknown B big number type"));

         switch (tmp4) {
            case "real":
               tmp4 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_B_REAL_STRING;
               break;
            case "raw":
               tmp4 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_B_RAW_STRING;
               break;
            case "hex":
               tmp4 = MY_NANO_JS.NANO_BIG_NUMBER_TYPE.NANO_B_RAW_128;
               break;
            default:
               return res.json(sendDefaultError(22, `Invalid B type value: ${tmp4}`));
         }

         tmp5 = verifyError(req.body.condition);

         if (!tmp5)
            return res.json(sendDefaultError(21, "Invalid/Unknown condition"));

         switch (tmp5) {
            case "gt":
               tmp5 = MY_NANO_JS.NANO_BIG_NUMBER_CONDITIONAL.NANO_COMPARE_GT;
               break;
            case "lt":
               tmp5 = MY_NANO_JS.NANO_BIG_NUMBER_CONDITIONAL.NANO_COMPARE_LT;
               break;
            case "eq":
               tmp5 = MY_NANO_JS.NANO_BIG_NUMBER_CONDITIONAL.NANO_COMPARE_EQ;
               break;
            case "geq":
               tmp5 = MY_NANO_JS.NANO_BIG_NUMBER_CONDITIONAL.NANO_COMPARE_GEQ;
               break;
            case "leq":
               tmp5 = MY_NANO_JS.NANO_BIG_NUMBER_CONDITIONAL.NANO_COMPARE_LEQ;
               break;
            default:
               return res.json(sendDefaultError(22, `Invalid condition: ${tmp5}`));
         }

         try {
            result = MY_NANO_JS.nanojs_compare(tmp1, tmp2, tmp3 + tmp4, tmp5);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, value_a: tmp1, value_b: tmp2, result: (result)?1:0});

      }

      if (command === COMMAND_BIP39_TO_ENCRYPETED_STREAM) {

/*
 req = {bip39: string, password: string}
*/
         tmp1 = verifyError(req.body.bip39);

         if (!tmp1)
            return res.json(sendDefaultError(22, "Missing: Bip39 worlist"));

         tmp2 = verifyError(req.body.password);

         if (!tmp2)
            return res.json(sendDefaultError(23, "Missing: Password"));

         try {
            result = MY_NANO_JS.nanojs_bip39_to_encrypted_stream(tmp1, 'dictionary.dic', tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, encrypted_stream: Buffer.from(result).toString('hex')});

      }

      if (command === COMMAND_SEED_TO_ENCRYPTED_STREAM) {
/*
 req = {seed: string, password: string}
*/
         tmp1 = verifyError(req.body.seed);

         if (tmp1 === false)
            return res.json(sendDefaultError(24, "Missing seed"));

         tmp2 = verifyError(req.body.password);

         if (tmp2 === false)
            return res.json(sendDefaultError(25, "Missing password"));

         try {
            result = MY_NANO_JS.nanojs_gen_seed_to_encrypted_stream(tmp1, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, encrypted_stream: Buffer.from(result).toString('hex')});
      }

      if (command === COMMAND_VERIFY_SIGNATURE) {
/*
 req = {signature: string, message: string, public_key: string, type: string}
*/
         tmp1 = verifyError(req.body.signature);

         if (!tmp1)
            return res.json(sendDefaultError(26, "Missing signature"));

         tmp2 = verifyError(req.body.message);

         if (!tmp2)
            return res.json(sendDefaultError(27, "Missing message or hash string"));

         tmp3 = verifyError(req.body.public_key);

         if (!tmp3)
            return res.json(sendDefaultError(28, "Missing public key or wallet"));

         tmp4 = verifyError(req.body.type);

         if (tmp4 === MY_NANO_JS_VERIFY_SIG_HASH)
            tmp5 = stringToArrayBuffer(tmp2, 'hex');
         else if (tmp4 === MY_NANO_JS_VERIFY_SIG_MSG)
            tmp5 = stringToArrayBuffer(tmp2, null);
         else
            return res.json(sendDefaultError(29, "Missing or wrong signature type"));

         try {
            result = MY_NANO_JS.nanojs_verify_message(tmp1, tmp5, tmp3);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, valid: (result)?1:0});

      }

      if (command === COMMAND_SIGN_MESSAGE) {
/*
 req = {message: string, private_key: string, type: string}
*/
         tmp1 = verifyError(req.body.message);

         if (!tmp1)
            return res.json(sendDefaultError(30, "Missing message"));

         tmp2 = verifyError(req.body.private_key);

         if (!tmp2)
            return res.json(sendDefaultError(31, "Missing private key"));

         tmp3 = verifyError(req.body.type);

         if (!tmp3)
            return res.json(sendDefaultError(32, "Missing signature type"));

         if (tmp3 === MY_NANO_JS_VERIFY_SIG_HASH)
            tmp4 = stringToArrayBuffer(tmp1, 'hex');
         else if (tmp3 === MY_NANO_JS_VERIFY_SIG_MSG)
            tmp4 = stringToArrayBuffer(tmp1, null);
         else
            return res.json(sendDefaultError(33, "Missing or wrong signature type"));

         try {
            result = MY_NANO_JS.nanojs_sign_message(tmp4, tmp2);
         } catch (e) {
            return res.json(sendDefaultError(e.code?parseInt(e.code):-1, e.message));
         }

         return res.json({error: 0, reason: SUCCESS_MESSAGE, signature: result});

      }

      return res.json({ error: -2, reason: "Unknown command"});

   }

}
