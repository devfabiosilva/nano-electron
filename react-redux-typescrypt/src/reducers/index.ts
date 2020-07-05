import { 

    combineReducers, 
    createStore

} from 'redux';

import { wallet } from './wallet_state';
import { lang } from './lang_interface';

import {

    openTransactionDialog,
    transactionDialogStatus 
    
} from './dialog_state';

import { monitore_pending_amount } from './monitore_pending_amount';
import { setBackGroundMode } from './backgroundmode';
import { notifyEvt } from './notifyevents';
import { showAboutMode } from './about';
import { tokenState } from './tokenizer';
import { verifySignWindowState } from './verify_sign';

import { 
    
    changeWalletWindowState,
    walletNumberHasChangedState

} from './change_wallet';

const nano_wallet_rootReducer = combineReducers(

    { 

        wallet,
        lang,
        openTransactionDialog,
        transactionDialogStatus,
        monitore_pending_amount,
        setBackGroundMode,
        notifyEvt,
        showAboutMode,
        tokenState,
        changeWalletWindowState,
        walletNumberHasChangedState,
        verifySignWindowState
        
    }

);

export const store = createStore(nano_wallet_rootReducer);
