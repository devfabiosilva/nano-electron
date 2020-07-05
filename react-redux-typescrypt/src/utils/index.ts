export const UNDEFINED = "UNDEFINED";
export const NANO_PREFIX = "nano_";
export const XRB_PREFIX = "xrb_";
export const MAX_FEE = "0.0001"; // In real (human readable)
export const DEFAULT_REPRESENTATIVE = "nano_3ngt59dc7hbsjd1dum1bw9wbb87mbtuj4qkwcruididsb5rhgdt9zb4w7kb9";
export const UNKNOWN_MY_NANO_PHP_SERVER_ERROR = "Unknown myNanoPHP server error";
export const SEND_COMMAND = "send";
export const RECEIVE_COMMAND = "receive";
export const OPEN_BLOCK_TO_RECEIVE = "open_block";
export const BACKGROUND_DARK = "dark";
export const BACKGROUND_LIGHT = "light";
export const QR_CODE_BG_DARK = "#244c54";
export const QR_CODE_FG_DARK = "#e9f6fb";
export const QR_CODE_BG_LIGHT = "#f5f6f8";
export const QR_CODE_FG_LIGHT = "#696969";
export const DEFAULT_NOTIFY_TIMEOUT = 5000; // in milliseconds
export const MY_NANO_PHP_DARK_MODE = "myNanoPHPDarkMode";
export const MY_NANO_PHP_VERIFY_SIG_HASH = "hash";
export const MY_NANO_PHP_VERIFY_SIG_MSG = "msg";
export const NANO_RPC_ERROR_MSG = "Nano RPC error %d";

export const NOTIFY_TYPE = {

    NOTIFY_TYPE_INFO: 0,
    NOTIFY_TYPE_ALERT: 1,
    NOTIFY_TYPE_ERROR: 2
    
}

export const NOTIFICATION_TIME = {

    TIME_FAST: 400,
    TIME_NORMAL: 800,
    TIME_SLOW: 1200,
    TIME_VERY_SLOW: 2400

}

export function changeToNanoPrefix(wallet: string): string {

    if ( wallet.indexOf(XRB_PREFIX) > -1 )
        return NANO_PREFIX+wallet.substr(4);

    return wallet;

}

export function getKey() {

    return Math.random().toString(36).substring(2);

}

export function generateToken(): string {
    return `@1A${getKey()}${getKey()}`;
}

export function saveToBinaryEncryptedStream(encrypted_stream: string) {

    let binary_blob: any;
    let a: any;
    let pseudo_url: any;

    binary_blob = new Blob(

        [Buffer.from(encrypted_stream, 'hex')],
        { type: 'application/octet-stream' }
    
    );

    a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    pseudo_url=window.URL.createObjectURL(binary_blob);

    a.href = pseudo_url;
    a.download = "myEncryptedNanoSeed.nse";
    a.click();
    window.URL.revokeObjectURL(pseudo_url);
    document.body.removeChild(a);

}

export function getBackgroundFromLocalStorage() {

    let darkMode: any = localStorage.getItem(MY_NANO_PHP_DARK_MODE);

    if ( ( darkMode === null ) || ( darkMode === undefined ) ) {

        localStorage.setItem(MY_NANO_PHP_DARK_MODE, BACKGROUND_DARK);
        darkMode = localStorage.getItem(MY_NANO_PHP_DARK_MODE) as string;

    }

    return darkMode;

}

export function setBackgroundToLocalStorage(mode: string) {

    localStorage.setItem(MY_NANO_PHP_DARK_MODE, mode);

    return localStorage.getItem(MY_NANO_PHP_DARK_MODE);

}

export const BRAND_IMAGE = 
'data:image/png;base64,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';
