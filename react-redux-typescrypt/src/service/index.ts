import axios from 'axios';

import { 

    NANO_NODE_URL, 
    NANO_P2P_PORT, 
    NANO_P2P_URI 

} from '../utils/nodes';

import {

    NANO_PREFIX,
    changeToNanoPrefix,
    NANO_JS_COMMANDS,
    MY_NANO_JS_VERIFY_SIG_MSG,
    UNKNOWN_MY_NANO_JS_SERVER_ERROR,
    MAX_FEE,
    MY_NANO_JS_GREATER_THAN,
    MY_NANO_JS_EQUAL,
    SEND_COMMAND,
    THRESHOLD_SEND_CURRENT,
    THRESHOLD_RECEIVE_CURRENT

} from '../utils';

import { 

    BRAINWALLET_RESPONSE, 
    GENERATED_ENCRYPTED_SEED,
    PUBLIC_KEY_TO_WALLET_RESPONSE,
    my_wallet,
    NEXT_PENDING_BLOCK_RESPONSE,
    ENCRYPTED_STREAM_RESULT,
    SIGNATURE_VERIFY,
    SIGNED_MESSAGE,
    OPEN_ENCRYPTED_SEED_RESPONSE,
    WALLET_TO_PUBLIC_KEY,
    NANOJS_RAW2REAL_RESULT,
    MY_NANO_JS_ERROR,
    MY_NANO_JS_SEED2KEYPAIR,
    ENTROPY_TYPE,
    BLOCK_RESPONSE,
    MY_NANO_JS_BLOCK_TO_JSON,
    MY_NANO_JS_P2POW_REQ_INFO,
    MY_NANO_JS_P2POW_ERROR,
    MY_NANO_JS_P2POW_WORK,
    BIG_NUMBER_COMPARE_RESPONSE

} from '../utils/wallet_interface';

const MY_NANO_PHP_URL = 'http://localhost';
const MY_NANO_JS_URL = 'http://localhost';
const MY_NANO_JS_URL_PORT = 8176;

// Take away this api in future
const api = axios.create({
    baseURL: MY_NANO_PHP_URL,
    headers:    {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
    validateStatus: function () {
        return true;
    }
});

const api_c_binding = axios.create({
    baseURL: `${MY_NANO_JS_URL}:${MY_NANO_JS_URL_PORT}`,
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: function() {
        return true;
    }
});

const p2pow_api =  axios.create({
    baseURL: `${NANO_P2P_URI}:${NANO_P2P_PORT}`,
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: function() {
        return true;
    }
});

// Nano NODE RPC API
// Documentation: https://docs.nano.org/commands/rpc-protocol/
const api_rpc = axios.create(
    {
        baseURL: NANO_NODE_URL,
        headers:    {
                        'Content-Type': 'application/json'
                    },
        validateStatus: function() {
            return true;
        }
    }
)
/* take away */
/*
export async function my_nano_php_api(send: any, function_name: string) {
    let data: any;

    await api.post('/template.php', send).then(
        (res) => data = res.data,
    );

    return (data)?(data.error)?data:{error: "-2", reason: "Unexpected format"}:
        {error: "-1", reason: "Something went wrong with " + function_name};

}*/
//// BEGIN NodeJS C bindings API
export async function my_nano_js_api(send: any, function_name: string) {
    let data: any;

    await api_c_binding.post('/data', send).then(
        (res) => data = res.data
    );

    if (data)
        return data;
    else
        return {error: "-1", reason: "Something went wrong with " + function_name};

}

export async function my_nano_js_raw2real(balance: string) {
    let data: NANOJS_RAW2REAL_RESULT|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_CONVERT_BALANCE,
        balance
    }, "my_nano_js_raw2real");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function  my_nano_js_open_encrypted_seed(block: string, password: string) {
    let data: OPEN_ENCRYPTED_SEED_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_ENCRYPTED_STREAM_TO_SEED,
        encrypted_stream: block,
        password
    }, "my_nano_js_open_encrypted_seed");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_seed2keypair(wallet_number: number, seed: string, prefix:string = NANO_PREFIX) {
    let data: MY_NANO_JS_SEED2KEYPAIR|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_SEED_TO_KEY_PAIR,
        seed,
        wallet_number,
        prefix
    }, "my_nano_js_seed2keypair");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_open_brainwallet(text: string, salt:string) {
    let data: BRAINWALLET_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_BRAINWALLET,
        text,
        salt
    }, "my_nano_js_open_brainwallet");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_generate_encrypted_seed(entropy: string, password: string) {
    let data: GENERATED_ENCRYPTED_SEED|MY_NANO_JS_ERROR;
    let entropyNumber: number;

    switch (entropy) {
        case ENTROPY_TYPE.EXCELENT:
            entropyNumber = 1476885281;
            break;
        case ENTROPY_TYPE.GOOD:
            entropyNumber = 1472531015;
            break;
        case ENTROPY_TYPE.NOT_ENOUGH:
            entropyNumber = 1471001808;
            break;
        case ENTROPY_TYPE.NOT_RECOMMENDED:
            entropyNumber = 1470003345;
            break;
        default:
            entropyNumber = 1477682819;
    }
   
    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_GEN_SEED_TO_ENCRYPTED_STREAM,
        entropy: entropyNumber,
        password
    }, "my_nano_js_generate_encrypted_seed");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_public_key_to_wallet(public_key:string, prefix: string = NANO_PREFIX) {
    let data: PUBLIC_KEY_TO_WALLET_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_PUBLIC_KEY_TO_WALLET,
        public_key,
        prefix
    }, "my_nano_js_public_key_to_wallet");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_encrypted_stream_to_key_pair(
    
    wallet_number: number,
    password: string, 
    encrypted_block: string,
    prefix: string = NANO_PREFIX

) {
    let data: MY_NANO_JS_SEED2KEYPAIR|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_ENCRYPTED_STREAM_TO_KEY_PAIR,
        wallet_number,
        password,
        encrypted_block,
        prefix
    }, "my_nano_js_encrypted_stream_to_key_pair");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}


export async function my_nano_js_compare(valueA: string, valueB: string, typeA: string, typeB: string, condition: string) {
    let data: BIG_NUMBER_COMPARE_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_COMPARE,
        value_a: valueA,
        value_b: valueB,
        type_a: typeA,
        type_b: typeB,
        condition
    }, "my_nano_js_compare");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_bip39_to_encrypted_stream(bip39: string, password: string) {
    let data: ENCRYPTED_STREAM_RESULT|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_BIP39_TO_ENCRYPETED_STREAM,
        bip39,
        password
    }, "my_nano_js_bip39_to_encrypted_stream");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}
export async function my_nano_js_seed_to_encrypted_stream(seed: string, password: string) {

    let data: ENCRYPTED_STREAM_RESULT|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_SEED_TO_ENCRYPTED_STREAM,
        seed,
        password
    }, "my_nano_js_seed_to_encrypted_stream");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_verify_message_sig(signature: string, message: string, public_key: string, type: string = MY_NANO_JS_VERIFY_SIG_MSG) {

    let data: SIGNATURE_VERIFY|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_VERIFY_SIGNATURE,
        signature,
        message,
        public_key,
        type
    }, "my_nano_js_verify_message_sig");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_sign_message(message: string, private_key: string, type: string = MY_NANO_JS_VERIFY_SIG_MSG) {

    let data: SIGNED_MESSAGE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_SIGN_MESSAGE,
        message,
        private_key,
        type
    }, "my_nano_js_sign_message");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_wallet_to_public_key(wallet: string) {

    let data: WALLET_TO_PUBLIC_KEY|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_WALLET_TO_PUBLIC_KEY,
        wallet
    }, "my_nano_js_wallet_to_public_key");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_create_block(
    account: string, 
    previous: string,
    representative: string,
    amount: string,
    link: string,
    value_to_send_or_receive: string,
    direction: number
) {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_CREATE_BLOCK,
        account, 
        previous,
        representative,
        amount,
        link,
        value_to_send_or_receive,
        direction
    }, "my_nano_js_create_block");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_sign_block(block: string, private_key: string) {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_SIGN_BLOCK,
        block,
        private_key
    }, "my_nano_js_sign_block");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_calculate_work_from_block(block: string, n_thr: number, threshold: string = "0xffffffc000000000") {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_CALCULATE_WORK_FROM_BLOCK,
        block,
        n_thr,
        threshold
    }, "my_nano_js_calculate_work_from_block");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_block_to_JSON(block: string) {

    let data: MY_NANO_JS_BLOCK_TO_JSON|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_BLOCK_TO_JSON,
        block
    }, "my_nano_js_block_to_JSON");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_block_to_p2pow(block: string, wallet: string, fee: string, representative: string|null = null) {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_BLOCK_TO_P2POW,
        block,
        wallet,
        fee,
        representative
    }, "my_nano_js_block_to_p2pow");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_p2pow_to_json(block: string) {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_BLOCK_TO_P2POW,
        block
    }, "my_nano_js_p2pow_to_json");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

export async function my_nano_js_sign_p2pow_block(block: string, private_key: string) {

    let data: BLOCK_RESPONSE|MY_NANO_JS_ERROR;

    data = await my_nano_js_api({
        command: NANO_JS_COMMANDS.COMMAND_P2POW_SIGN_BLOCK,
        block,
        private_key
    }, "my_nano_js_sign_p2pow_block");

    return new Promise((res, error) => {
        return (data.error === 0)?res(data):error(data);
    });
}

/// END NodeJS C bindings API

export async function my_nano_js_send_receive_money(
    wallet: my_wallet, 
    destination_wallet: string, 
    amount_to_send_receive: string,
    direction: number
)
{
    let fee: any = null;
    let worker_wallet: any = null;

    if ((wallet.fee !== undefined) && (wallet.fee !== "")) {
        let req_info: any = await requestInfo();
        let compare: any;
console.log(req_info);
        if (req_info === null)
            return new Promise((res, err) => {
                err({error: -20, reason: "Unable to reach P2PoW endpoint"});
            });

        if ((req_info as MY_NANO_JS_P2POW_ERROR).error)
            return new Promise((res, err) => {
                err(req_info)
            });

        fee = (req_info as MY_NANO_JS_P2POW_REQ_INFO).fee;
        worker_wallet = (req_info as MY_NANO_JS_P2POW_REQ_INFO).reward_account;

        compare = await my_nano_js_compare(fee, MAX_FEE, "raw", "real", MY_NANO_JS_GREATER_THAN);

        if (!compare)
            return new Promise((res, err) => {
                err({error: -21, reason: "Unable to reach \"my_nano_js_compare\" C function"});
            });

        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).error !== 0)
            return new Promise((res, err) => {
                err(compare);
            });

        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).result !== 0)
            return new Promise((res, err) => {
                err({error: -22, reason: "Worker fee is greater than MAXIMUM ALLOWED FEE"});
            });

        compare = await my_nano_js_compare(fee, MAX_FEE, "raw", "real", MY_NANO_JS_GREATER_THAN);

        if (!compare)
            return new Promise((res, err) => {
                err({error: -21, reason: "Unable to reach \"my_nano_js_compare\" C function"});
            });

        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).error !== 0)
            return new Promise((res, err) => {
                err(compare);
            });

        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).result !== 0)
            return new Promise((res, err) => {
                err({error: -22, reason: "Worker fee is greater than MAXIMUM ALLOWED FEE"});
            });

        compare = await my_nano_js_compare(fee, wallet.fee, "raw", "real", MY_NANO_JS_EQUAL);

        if (!compare)
            return new Promise((res, err) => {
                err({error: -23, reason: "Unable to reach \"my_nano_js_compare\" C function"});
            });
    
        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).error !== 0)
            return new Promise((res, err) => {
                err(compare);
            });
    
        if ((compare as BIG_NUMBER_COMPARE_RESPONSE).result !== 1)
            return new Promise((res, err) => {
                err({error: -24, reason: "Fee must match with worker fee"});
            });

    }
console.log("Aqui")
    return new Promise((resolve, reject) => {

        let private_key: string = `${(wallet.private_key as string)}${wallet.public_key as string}`;

        //if ((wallet.fee !== undefined) && (wallet.fee !== "")) {
        if (fee !== null) {

            my_nano_js_create_block(
                wallet.wallet as string, 
                wallet.frontier as string, 
                wallet.wallet_representative as string, 
                wallet.balance as string, 
                destination_wallet,
                amount_to_send_receive,
                direction
            ).then(
            //my_nano_php_api(`command=create_block&account=${wallet.wallet}&previous=${wallet.frontier}&representative=${wallet.wallet_representative}&balance=${wallet.balance}&val_send_rec=${amount_to_send_receive}&link=${destination_wallet}&direction=${direction}`, "my_nano_php_send_money").then(
                (d: any) => {
                    if (d.error === 0) {
                        if (d.block){
                            my_nano_js_block_to_p2pow(d.block, worker_wallet, fee).then(
                            //my_nano_php_api(`command=block_to_p2pow&block=${d.block}&wallet=${wallet.worker_wallet}&fee=${wallet.fee}`, "my_nano_php_send_money").then(
                                (worker: any) => {
                                    //if (worker.error === "0") {
                                    if (worker.error === 0) {
                                        if (worker.block) {
                                            my_nano_js_sign_p2pow_block(worker.block, private_key).then(
                                            //my_nano_php_api(`command=sign_p2pow_block&block=${worker.block}&private_key=${private_key}`, "my_nano_php_send_money").then(
                                                (signed_p2pow_block: any) => {
                                                    if (signed_p2pow_block.error === 0) {
                                                        if (signed_p2pow_block.block) {
                                                            my_nano_js_p2pow_to_json(signed_p2pow_block.block).then(
                                                            //my_nano_php_api(`command=p2pow_to_json&block=${signed_p2pow_block.block}`, "my_nano_php_send_money").then(
                                                                (p2pow_to_json: any) => {
                                                                    //if (p2pow_to_json.error === "0")
                                                                    if (p2pow_to_json.error === 0) {
                                                                        //resolve(p2pow_to_json);
                                                                        requestPow(p2pow_to_json.block).then(
                                                                            (success: any) =>
                                                                                resolve(success),
                                                                            (error: any) =>
                                                                                reject(error)
                                                                        );
                                                                    } else if (p2pow_to_json.error)
                                                                        reject(p2pow_to_json);
                                                                    else
                                                                        reject({error:"-16", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                                }
                                                            )
                                                        } else
                                                            reject({error:"-15", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                    } else if (signed_p2pow_block.error)
                                                        reject(signed_p2pow_block);
                                                    else
                                                        reject({error:"-14", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                }
                                            );
                                        } else
                                            reject({error:"-13", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});

                                    } else if (worker.error)
                                        reject(worker);
                                    else
                                        reject({error:"-12", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                }
                            );
                        } else
                            reject({error:"-11", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                    } else if (d.error) {
                        reject(d);
                    } else
                        reject({error:"-10", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                }
            );
        } else
            //my_nano_php_api(`command=create_block&account=${wallet.wallet}&previous=${wallet.frontier}&representative=${wallet.wallet_representative}&balance=${wallet.balance}&val_send_rec=${amount_to_send}&link=${destination_wallet}&direction=${direction}`, "my_nano_php_send_money").then(
            my_nano_js_create_block(
                wallet.wallet as string, 
                wallet.frontier as string, 
                wallet.wallet_representative as string, 
                wallet.balance as string, 
                destination_wallet,
                amount_to_send_receive,
                direction
            ).then(
                (d: any) => {
                    if (d.error === 0) {
                        if (d.block)
                            //my_nano_php_api(`command=sign_block&block=${d.block}&private_key=${private_key}`, "my_nano_php_send_money").then(
                            my_nano_js_sign_block(d.block, private_key).then(
                                (signed_block: any) => {
                                    if (signed_block.error === 0) {
                                        if (signed_block.block) {
                                            //my_nano_php_api(`command=calculate_work_from_block&block=${signed_block.block}&n_thr=4`, "my_nano_php_send_money").then(
                                            my_nano_js_calculate_work_from_block(signed_block.block, 4, (direction === SEND_COMMAND)?THRESHOLD_SEND_CURRENT:THRESHOLD_RECEIVE_CURRENT).then(
                                                (proof_of_work: any) => {
                                                    if (proof_of_work.error === 0) {
                                                        console.log(proof_of_work.block)
                                                        if (proof_of_work.block)
                                                            //my_nano_php_api(`command=block_to_json&block=${proof_of_work.block}`, "my_nano_php_send_money").then(
                                                            my_nano_js_block_to_JSON(proof_of_work.block).then(
                                                                (block_to_json: any) => {
                                                                    console.log(block_to_json);
                                                                    if (block_to_json.error === 0)
                                                                        nano_rpc_account_send_signed_block(block_to_json.block).then(
                                                                            (record_blockchain: any) => {
                                                                                if (record_blockchain.error)
                                                                                    reject(record_blockchain);
                                                                                resolve(record_blockchain);
                                                                            },
                                                                            (err) => { 
                                                                                console.log(err);
                                                                                reject(err) 
                                                                            }

                                                                        );
                                                                    else if (block_to_json.error)
                                                                        reject(block_to_json);
                                                                    else
                                                                        reject({error:"-7", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                                },
                                                                (e) => {
                                                                    console.log(e);
                                                                    reject(e)
                                                                }
                                                            )
                                                        else
                                                            reject({error:"-6", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                    } else if (proof_of_work.error)
                                                        reject(proof_of_work);
                                                    else
                                                        reject({error:"-5", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                                },
                                                (e) => {
                                                    console.log(e);
                                                    reject(e)
                                                }
                                            );
                                        } else
                                            reject({error:"-4", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                    } else
                                        reject({error:"-3", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                                },
                                (e) => { 
                                    console.log(e);
                                    reject(e) 
                                }
                            )
                        else
                            reject({error:"-2", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                    } else if (d.error) {
                        reject(d)
                    } else
                        reject({error:"-1", reason: UNKNOWN_MY_NANO_JS_SERVER_ERROR});
                },
                (e) => {
                    console.log(e);
                    reject(e)
                }
            );
    });

}

////// nano rpc
///https://docs.nano.org/commands/rpc-protocol/

export async function nano_rpc_account_balance(account: string) {
    let data: any = null, err: any;

    await api_rpc.post('/', {
        action: "account_balance",
        account 
    }).then(
        (d) => data = d.data,
        (e) => err = e.data
    );
    
    return new Promise((resolve, reject) => (data)?(data.error)?reject({error: data.error}):resolve(data):reject(err));
}

export async function nano_rpc_account_representative(account: string) {
    let data: any = null, err: any;

    await api_rpc.post('/', {
        action: "account_representative",
        account
    }).then(
        (d) => data = d.data,
        (e) => err = e.data
    );

    return new Promise((resolve, reject) => (data)?(data.error)?reject({error: data.error}):resolve(data):reject(err));

}

export async function nano_rpc_account_frontier(account: string) {
    let data: any = null, err: any;

    await api_rpc.post('/', {
        action: "accounts_frontiers",
        accounts: [ account ]
    }).then(
        (d) => data = d.data,
        (e) => err = e.data
    );
    
    return new Promise((resolve, reject) => (data)?(data.error)?reject({error: data.error}):resolve(data):reject(err));

}

export async function nano_rpc_account_send_signed_block(block: any) {
    let data: any = null, err: any;

    await api_rpc.post('/', block).then(
        (d) => data = d.data,
        (e) => err = e.data
    );
    
    return new Promise((resolve, reject) => (data)?(data.error)?reject({error: data.error}):resolve(data):reject(err));

}

export async function nano_rpc_get_pending(account: string) {

    let data: any = null, err: any;
    let amount_raw: string, block: string, tmp1: any, tmp2: any;
    let account_tmp = changeToNanoPrefix ( account );

    await api_rpc.post('/', {
        action: "accounts_pending",
        accounts: [ account_tmp ],
        count: "1",
        source: "true"
    }).then(
        (d: any) => {
            if (d) {
                if ( (tmp1 = d.data['blocks']) ) {

                    if ( (tmp2 = tmp1[account_tmp]) ) {

                        if ( (block = Object.keys(tmp2)[0]) ) {

                            if ( (amount_raw = tmp2[block].amount) ) {
                                data = {

                                    block,
                                    amount_raw,

                                } as NEXT_PENDING_BLOCK_RESPONSE;
                            } else
                                err = { error: `Can't find amount in account ${account}` }

                        } else
                            err = { error: `Can't find block in account ${account}`}

                    } else
                        err = { error: `Can't find ${account} in block`};
                    
                } else
                    err = {error: "Unknown block in RPC"};
            } else
                err = { error: "Empty response" };
        },
        (e) => err = e.data
    );
    
    return new Promise((resolve, reject) => (data)?(data.error)?reject({error: data.error}):resolve(data):reject(err));

}

///// p2pow server

/// Will be implemented

async function requestInfo() {
    let data: MY_NANO_JS_P2POW_REQ_INFO|MY_NANO_JS_P2POW_ERROR;
 
    data = await p2pow_api.get('/request_info');
 
    return new Promise((res, err) => {

       if (!data) {
            (data as MY_NANO_JS_P2POW_ERROR).error = 100;
            (data as MY_NANO_JS_P2POW_ERROR).reason = "Unable to request P2PoW info";
            return err(data);
       }
 
       return res(data as MY_NANO_JS_P2POW_REQ_INFO);

    });
 }

 async function requestPow(signedP2PoWJSON: any) {
    let data: MY_NANO_JS_P2POW_WORK|MY_NANO_JS_P2POW_ERROR;
 
    data = await p2pow_api.post('/request_work', signedP2PoWJSON);
 
    return new Promise((res, err) => {

       if (!data) {
            (data as MY_NANO_JS_P2POW_ERROR).error = 101;
            (data as MY_NANO_JS_P2POW_ERROR).reason = "Unable to perform a P2PoW transaction";
            return err(data);
       }
 
       return res(data as MY_NANO_JS_P2POW_WORK);

    });
 }
