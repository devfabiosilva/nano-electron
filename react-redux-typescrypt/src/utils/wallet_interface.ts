export const WALLET_FROM = {

    SELECT_OPTION: "-1",
    FROM_SEED: "1",
    FROM_BIP39: "2",
    FROM_BRAINWALLET: "3",
    FROM_ENCRYPTED_FILE: "4",
    FROM_GENERATING_SEED: "5",
    FROM_KEY_PAIR: "6",
    FROM_PUBLIC_KEY: "7"

}

export const ENTROPY_TYPE = {

    PARANOIC: "paranoic",
    EXCELENT: "excelent",
    GOOD: "good",
    NOT_ENOUGH: "not_enough",
    NOT_RECOMMENDED: "not_recommended"

}

export interface SEED_AND_BIP39 {
    seed?: string,
    bip39?: string
}
/* Take Away */
/*
export interface MY_NANO_PHP_SEED2KEYPAIR {
    error: string|number,
    reason: string,
    key_pair: {
        private_key: string,
        public_key: string,
        wallet_number: number|string,
        wallet: string
    }
}
*/
export interface MY_NANO_PHP_PK2ADDRESS {
    error: string|number,
    reason: string,
    wallet: string,
    public_key: string
}

/* Take away */
export interface MY_NANO_PHP_ERROR {

    error: string|number,
    reason: string

}

export interface my_wallet {

    origin?: string|number,
    seed?: string; // SECURITY: Fire and forget. Extract public key from encrypted file|brainwallet|Bip39 and forget SEED immediately
    public_key: string|null;
    private_key?: string; //SECURITY: Fire and forget. Extract public key from (encrypted file|brainwallet|Bip39) and forget private key immediately
    wallet_number?: number;
    wallet_representative?: string,
    wallet?: string,
    pending?: string,
    balance?: string,
    bip39?: string  //SECURITY: Fire and forget. Extract public key from (encrypted file|brainwallet|Bip39) and forget private key immediately
    encrypted_block?: string,
    frontier?: string,
    fee?: string,
    worker_wallet?: string

}

export interface NANO_KEY_PAIR {

    private_key?: string,
    public_key: string,
    wallet_number?: number|string,
    wallet?: string,
    representative?: string
    
}

export interface PUBLIC_KEY2ADDRESS {

    error: string|number,
    reason: string
    wallet: string,
    public_key: string,

}
/*
export interface BRAINWALLET_RESPONSE {

    error: string|number,
    reason: string,
    text: string,
    salt: string,
    extracted: {
      result: {
        seed: string,
        bip39: string
      },
      warning_msg: string
    },
    warning: string

}
*/
export interface BRAINWALLET_RESPONSE {

    error: string|number,
    reason: string,
    text: string,
    salt: string,
    extracted: {
      result: {
        seed: string,
        bip39?: string
      },
      warning_msg: string
    },
    warning?: string

}

export interface GENERATED_ENCRYPTED_SEED {

    error: string|number,
    reason: string,
    encrypted_seed: string

}

export interface OPEN_ENCRYPTED_SEED_RESPONSE {

    error: string|number,
    reason: string,
    result: {
        seed: string,
        bip39: string
    }

}

export interface PUBLIC_KEY_TO_WALLET_RESPONSE {

    error: string|number,
    reason: string,
    wallet: string,
    public_key: string

}

export interface BLOCK_RESPONSE {

    error: string|number,
    reason: string,
    block: string

}

export interface BIG_NUMBER_COMPARE_RESPONSE {
    error: string|number,
    reason: string,
    result: number
}

export interface NEXT_PENDING_BLOCK_RESPONSE {
    block: string,
    amount_raw: string,
    amount_real: string
}

export interface PENDING_AMOUNT_TO_POCKET {
    amount: string,
    block: string
}

export interface NOTIFY_MESSAGE {

    key?: string,
    notify_type?: number,
    msg?: string,
    timeout?: number,

}

export interface ENCRYPTED_STREAM_RESULT {

    error?: string|number,
    reason?: string,
    encrypted_stream?: string

}

export interface SIGNATURE_VERIFY {

    error?: string|number,
    reason?: string,
    valid?: string|number
    
}

export interface SIGNED_MESSAGE {

    error?: string|number,
    reason?: string,
    signature?: string

}

export interface WALLET_TO_PUBLIC_KEY {

    error?: string|number,
    reason?: string,
    wallet?: string,
    public_key?: string

}
/* Take away */
export interface RAW2REAL_RESULT {

    error?: string|number,
    reason?: string,
    balance?: string,
    real_balance?: string

}

//
export interface MY_NANO_JS_ERROR {

    error: string|number,
    reason: string

}

export interface NANOJS_RAW2REAL_RESULT {

    error?: string|number,
    reason?: string,
    balance?: string,
    converted_balance?: string

}

export interface MY_NANO_JS_SEED2KEYPAIR {

    error: string|number,
    reason: string,
    key_pair: {
        private_key: string,
        public_key: string,
        wallet_number: number|string,
        wallet: string
    }

}

export interface MY_NANO_JS_BLOCK_TO_JSON {
    error: string|number,
    reason: string,
    block: any
}
/*
export interface MY_NANO_JS_P2POW_REQ_INFO {
    fee: string,
    max_multiplier: number,
    min_multiplier: number,
    reward_account: string,
    version: string
}
*/
export interface MY_NANO_JS_P2POW_REQ_INFO {
				 
    version: string,
    status: string,
    reward_account: string,
    fee: string,
    fee_receive: string,
    dynamic_fee: boolean,
    last_update: number,
    min_multiplier: number,
    max_multiplier: number,
    network: {
        minimum: string,
        minimum_receive_minimum: string,
        current: string,
        receive_current: string,
        multiplier: string
    }
}


export interface MY_NANO_JS_P2POW_WORK {
    hash: string
}

export interface MY_NANO_JS_P2POW_ERROR {
    error: number,
    reason: string
}

export interface MY_NANO_JS_TO_P2POW_BLOCK {
    error: string|number,
    reason: string,
    block: {
        user_block: {
            block_type: string,
            account: string,
            previous: string,
            representative: string,
            balance: string,
            link: string,
            link_as_account: string,
            signature: string
          },
          reward_block: {
            block_type: string,
            account: string,
            previous: string,
            representative: string,
            balance: string,
            link: string,
            link_as_account: string,
            signature: string
          }
    }

}

//