import React, { 

  useEffect, 
  useState, 
  useRef 

} from 'react';

import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import Dialog from '../Dialog';

import {

  nano_rpc_account_balance,
  my_nano_php_raw2real,
  nano_rpc_account_representative,
  nano_rpc_account_frontier,
  my_nano_php_send_receive_money,
  nano_rpc_get_pending,

} from '../../service';

import { 

  UNDEFINED,
  MAX_FEE,
  DEFAULT_REPRESENTATIVE,
  SEND_COMMAND,
  RECEIVE_COMMAND,
  OPEN_BLOCK_TO_RECEIVE,
  NOTIFY_TYPE,
  BACKGROUND_DARK,
  QR_CODE_BG_LIGHT,
  QR_CODE_BG_DARK,
  QR_CODE_FG_DARK,
  QR_CODE_FG_LIGHT,
  NOTIFICATION_TIME,
  NANO_RPC_ERROR_MSG,

} from '../../utils';

import { 
  
  setMyWallet, 
  openWalletDialog, 
  dialogStatus, 
  clearPendingAmout,
  setPendingAmount,
  closeWalletDialog,
  setNotifyMessage,
  resetWallet,
  changeWalletWindow,
  walletNumberhasChanged,
  changeSignVerifyWindow

} from '../../actions';

import { 

  my_wallet, 
  PENDING_AMOUNT_TO_POCKET, 
  NOTIFY_MESSAGE,
  WALLET_FROM,
  MY_NANO_PHP_ERROR

} from '../../utils/wallet_interface';

import { 
  
  FiSend, 
  FiSkipBack, 
  FiEdit3

} from 'react-icons/fi';

import { FaWallet } from 'react-icons/fa';
import SignMessage from '../SignMessage';
import { TOKENIZER } from '../../reducers/tokenizer';
import './style.css';

export function Wallet(props: any) {

  const [ balance, setBalance] = useState("");
  const [ pendingAccount, setPendingAccount ] = useState("");
  const [ fee, setFee ] = useState(false);
  const [ representative, setRepresentative ] = useState("");
  const [ walletReady, setWalletReady ] = useState(false);
  const [ lockInputs, setLockInputs ] = useState(true);

  const [ openPendingBlock, setOpenPendingBlock ] = useState<PENDING_AMOUNT_TO_POCKET>({

    amount: "", // in Real value
    block: ""

  });

  const verifyPendingRef = useRef(verifyPending);

  useEffect(

    () => {

      let obj_dest_wallet: any;
      let obj_amount_to_send_receive: any;
      let dest_wallet: string; // destination wallet or link
      let amount_to_send_receive: string;
      let tmp: string;

      let changeWalletBtn: any = document.getElementById('change-wallet-btn-id');
      let sendButton: any = document.getElementById('send-button-id');
      let destinationWallet: any = document.getElementById('destination-wallet-id');
      let valueToSend: any = document.getElementById('value-to-send-id');
      let feeCheckBox: any = document.getElementById('fee-checkbox-id');

      sendButton.disabled = ((props.state as my_wallet).origin === WALLET_FROM.FROM_PUBLIC_KEY);
      destinationWallet.disabled = sendButton.disabled;
      valueToSend.disabled = sendButton.disabled;
      feeCheckBox.disabled = sendButton.disabled;
      changeWalletBtn.disabled = ((props.state as my_wallet).origin === WALLET_FROM.FROM_KEY_PAIR)||sendButton.disabled;

      if (props.walletNumberHasChangedState) {

        setWalletReady(false);
        props.walletHasChanged();

      }

      if ( (props.dialog_status === SEND_COMMAND) || (props.dialog_status === RECEIVE_COMMAND) ) {

        if (props.dialog_status === SEND_COMMAND) {

          obj_amount_to_send_receive = document.getElementById('value-to-send-id');

          if (( amount_to_send_receive = obj_amount_to_send_receive.value.trim() ) === "") {

            props.newNotification({

              notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
              msg: props.language.msg_amount_is_empty

            } as NOTIFY_MESSAGE);
            props.dialogStatus();
            return;

          }

          obj_dest_wallet = document.getElementById('destination-wallet-id');

          if (( dest_wallet = obj_dest_wallet.value.trim() ) === "") {

            alert( props.language.msg_destination_wallet_empty );
            props.dialogStatus();
            return;

          }

        } else {

          dest_wallet = openPendingBlock.block;
          amount_to_send_receive = openPendingBlock.amount

        }

        my_nano_php_send_receive_money(props.state as my_wallet, dest_wallet, amount_to_send_receive, props.dialog_status).then(
          (transaction_result: any) => {
            setWalletReady(false);
            props.closeDialog();
            props.dialogStatus();
            props.newNotification({

              msg: props.language.msg_transaction_success.replace(/%d/, transaction_result.hash),

            } as NOTIFY_MESSAGE);

            if (obj_amount_to_send_receive)
              obj_amount_to_send_receive.value = "";
            
            if (obj_dest_wallet)
              obj_dest_wallet.value = "";

          },
          (transaction_result_error: any) => {

            setWalletReady(false);
            props.closeDialog();
            props.dialogStatus();
            props.newNotification({

              notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
              msg: "Transaction error. Try again :(",
              timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

            } as NOTIFY_MESSAGE);

          }
        );

      }

      if (walletReady) {

        if (props.dialog_is_open) {

          if (!lockInputs)
            setLockInputs(true);

        } else {

          if (lockInputs)
            setLockInputs(false);

          if ((props.state as my_wallet).origin !== WALLET_FROM.FROM_PUBLIC_KEY )
            if (props.dialog_status === "")
              if (!props.monitore_pending.pending_function)
                if ((props.isSignedVerifyWindowClosed)&&((props.token as TOKENIZER).showWindow === false))
                   if (props.closedChangeWalletState)
                      props.enablePendingMonitor(verifyPendingRef.current);

        }

      } else {

        props.disablePendingMonitor();
        setLockInputs(true);
        nano_rpc_account_balance(props.state.wallet).then(
          (data: any) => {
            (data)?
              (data.balance)?
                my_nano_php_raw2real(data.balance).then(
                  (d: any) => {
                    my_nano_php_raw2real(data.pending).then(
                      (pending_balance: any) => {
                        props.setMyWallet({
                          balance: d.real_balance,
                          pending: pending_balance.real_balance
                        });
                        setBalance(props.state.balance);
                        setPendingAccount(props.state.pending);
                        tmp = props.language.success_open_wallet.replace(/%d/, props.state.wallet).replace(/%e/, props.state.balance);

                        props.newNotification(
                          {
                            msg: tmp.replace(/%f/, props.state.pending),
                          } as NOTIFY_MESSAGE
                        )
                      },
                      (error: any) => 
                        props.newNotification({

                          notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
                          msg: `${(error as MY_NANO_PHP_ERROR).error} ${(error as MY_NANO_PHP_ERROR).reason}`,
                          timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

                        } as NOTIFY_MESSAGE)
                    );
                  },
                  (e: any) => {
                    props.setMyWallet({
                      balance: e.reason
                    });
                  }
                )
              :props.setMyWallet(
                {
                  balance:UNDEFINED
                }
              )
            :props.setMyWallet(
              {
                balance:UNDEFINED
              }
            );
          },
          (error) => 
          props.newNotification({

            notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
            msg: NANO_RPC_ERROR_MSG.replace(/%d/, error.error),
            timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

          } as NOTIFY_MESSAGE)
        ).then(
          () => {
            nano_rpc_account_representative(props.state.wallet).then(
              (data: any) => {
                if (data) {
                  if (data.representative) {
                    props.setMyWallet({
                      wallet_representative: data.representative
                    });
                    setRepresentative(props.state.wallet_representative);
                  } else {
                    props.setMyWallet({
                      wallet_representative: DEFAULT_REPRESENTATIVE
                    });
                  }
                  
                } else
                  setRepresentative("Unknown Nano RPC JSON data");

              },
              (e) => {

                if (e) {
                  if (e.error) {

                    props.setMyWallet({
                      wallet_representative: DEFAULT_REPRESENTATIVE
                    });

                    setRepresentative(DEFAULT_REPRESENTATIVE);
                    setWalletReady(true);
                    setLockInputs(false);
                  } else
                    setRepresentative("Unknown Error");
                } else {
                  setRepresentative("Unknown response");
                }

              }
            );
          }
        ).then(
          () => {
            nano_rpc_account_frontier(props.state.wallet).then(
              (data: any) => {
                if (data.frontiers) {
                  if (data.frontiers[props.state.wallet])
                    props.setMyWallet({
                      frontier: data.frontiers[props.state.wallet]
                    });
                }

                if (props.state.frontier === undefined)
                  props.setMyWallet({
                    frontier: ""
                  });

                  setWalletReady(true);
                  setLockInputs(false);

              },
              () => {
                props.setMyWallet({
                  frontier: ""
                });
              }
            )
          }
        );

      }
    },
    [

      props,
      walletReady,
      lockInputs,
      openPendingBlock
      
    ]
  
  );

  function verifyPending() {

    let pending_value: any = (props.state as my_wallet).pending;
    let block: string;
    let amount: string;
//console.log("tic-tac")
    if ( (pending_value !== '0.0') ) {
      props.disablePendingMonitor();
      nano_rpc_get_pending( (props.state as my_wallet).wallet as string ).then(
        (pending_res: any) => {
          if (pending_res.amount_raw) {

            if ( (block = pending_res.block ) ) 
              my_nano_php_raw2real(pending_res.amount_raw).then(
                (raw2real_res: any) => {
                    if ( (amount = raw2real_res.real_balance)) {
                      setOpenPendingBlock({

                        amount,
                        block

                      });

                      if (props.dialog_status === "") {

                        props.dialogStatus(OPEN_BLOCK_TO_RECEIVE);
                        props.disablePendingMonitor();
                        props.openDialog();
                  
                      }

                    } else
                      props.newNotification({

                        notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
                        msg: "Missing balance",

                      } as NOTIFY_MESSAGE);

                  },
                  (raw2real_err: any) => 
                    props.newNotification({
                    
                      notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
                      msg: `${(raw2real_err as MY_NANO_PHP_ERROR).error} ${(raw2real_err as MY_NANO_PHP_ERROR).reason}`,
                      timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

                    } as NOTIFY_MESSAGE)
                )
            else
              props.newNotification({
              
                notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
                msg: "Can't find block",
                timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

              } as NOTIFY_MESSAGE)
          } else
            props.newNotification({
                
              notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
              msg: "Error big number amount raw not found",
              timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

            } as NOTIFY_MESSAGE)
        },
        (pending_err: any) => 
          props.newNotification({

            notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ERROR,
            msg: NANO_RPC_ERROR_MSG.replace(/%d/, pending_err.error),
            timeout: NOTIFICATION_TIME.TIME_VERY_SLOW

          } as NOTIFY_MESSAGE)
      )

    }
  }

  function beginSendAmount() {

    let destinationWallet: any = document.getElementById('destination-wallet-id');
    let valueToSend: any = document.getElementById('value-to-send-id');

    if (destinationWallet.value === "") {
      props.newNotification({

        notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ALERT,
        msg: props.language.msg_missing_dest_wallet,
        timeout: NOTIFICATION_TIME.TIME_SLOW

      } as NOTIFY_MESSAGE);

      return;

    }

    if (valueToSend.value.trim() === "") {

      props.newNotification({

        notify_type: NOTIFY_TYPE.NOTIFY_TYPE_ALERT,
        msg: props.language.msg_missing_amount_to_send,
        timeout: NOTIFICATION_TIME.TIME_SLOW

      } as NOTIFY_MESSAGE);

      return;

    }

    if (props.dialog_status === "") {

      props.disablePendingMonitor();
      props.openDialog();

    }

  }

  return (
    <div className="wallet-container">
      <Dialog />
      <div className="wallet-number-container">
        <div className="wallet-number-div">
          <div className="wallet-number-title">
            { props.language.wallet_number }:
          </div>
          <div className="wallet-number">
            { props.state.wallet_number }
          </div>
        </div>
        <div className="button-div">
          <button

            className="change-wallet-btn"
            id="change-wallet-btn-id"
            onClick={ () => { 
              
                props.disablePendingMonitor();
                props.showChangeWalletWindow(); 

              }
            }
            title={ props.language.change_wallet  }

          >
            <FaWallet size={22} style={ { marginRight: "8px" } } />{ props.language.change_wallet }
          </button>
          <button

            className="sign-message-btn"
            title={ props.language.sign_verify_message }
            onClick={ () => {
              
              props.disablePendingMonitor();
              props.openSignVerifyWindow();

            }}

          >
            <FiEdit3 size={22} style={ { marginRight: "8px" } } />{ props.language.sign_verify_message }
          </button>
        </div>
      </div>
      <div className="wallet-address-container">
        <div className="wallet-address-title">{ props.language.wallet }:</div>
        <div className="wallet-address">{ props.state.wallet }</div>
      </div>
      <div className="wallet-public-key-container">
        <div className="wallet-public-key-title">{ props.language.pk }</div>
        <div className="wallet-public-key">{ props.state.public_key }</div>
      </div>
      <div className="representative-wallet-container">
        <div className="prepresentative-title">
          { props.language.representative_title }:
        </div>
        <div className="representative-wallet" >
          { representative }
        </div>
      </div>
      <div className="balance-container">
        <div className="balance-title">
          { props.language.balance }:
        </div> 
        <div className="balance">
          { (balance)?balance:props.language.loading_balance }
        </div>
      </div>
      <div className="pending-account-container">
        <div className="pending-account-title">
          { props.language.pending_account }:
        </div>
        <div className="pending-account">
          { (pendingAccount)?pendingAccount:props.language.loading_pending }
        </div>
      </div>
      <div className="destination-wallet-container">
        <div className="destination-wallet-title">
          { props.language.destination_wallet_label }:
        </div>
        <div className="destination-wallet">
          <input 

            type = "text" 
            id = "destination-wallet-id"
            className = "destination-wallet-input"
            placeholder = { props.language.placeholder_dest_wallet }

          />
        </div>
      </div>
      <div className="value-to-send-container">
        <div className="value-to-send-tite">
          { props.language.amount }:
        </div>
        <div className="value-to-send">
          <input 

            type = "text"
            id = "value-to-send-id"
            className = "value-to-send-input" 
            placeholder= { props.language.placeholder_amount_to_send }

          />
        </div>
      </div>
      <div className="fee-container">
        <div className="fee-title">
          { props.language.label_allow_p2pow_dpow_label }
        </div>
        <div className="sub-fee-container">
          <div className="fee-checkbox-container">
            <input 

              className="fee-checkbox"
              id="fee-checkbox-id"
              type="checkbox" 
              checked={ fee }
              onChange={() => setFee(!fee)}

            />
          </div>
          <div 

            className="fee-label-value-container" 
            style={{display:(fee)?"inline-block":"none"}}

          >
            <label className="fee-label-title">
                { props.language.label_fee }
            </label>
            <input 

              className="fee-input" 
              type="text" 
              defaultValue={ MAX_FEE } 
              placeholder={ props.language.placeholder_type_your_fee }

            />
          </div>
        </div>
      </div>
      <div 
        className="button-container"
        style={
          {
            display:(lockInputs)?"none":"inline-block"
          }
        }
      >
        <button 

          className="send-button"
          id="send-button-id"
          onClick={ () => beginSendAmount() }
          title={ props.language.btn_send_title }

        >
          { props.language.send } <FiSend size={16} style={{paddingLeft: "4px"}} />
        </button>
      </div>
      <div 
        className="button-back-container"
        style={
          {
            display:(lockInputs)?"none":"inline-block"
          }
        }
      >
        <button 

          className="back-button"
          onClick={ () => {

              props.disablePendingMonitor();
              props.goBack();
            
            }}
          title={ props.language.go_back }

        >
          <FiSkipBack size={20} style={{paddingRight: "4px"}} /> { props.language.go_back }
        </button>
      </div>
      <div className="qr-code-container">
        <QRCode 

          value={ props.state.wallet }
          renderAs="svg"
          bgColor={ (props.backgroundMode === BACKGROUND_DARK)?QR_CODE_BG_DARK:QR_CODE_BG_LIGHT }
          fgColor={ (props.backgroundMode === BACKGROUND_DARK)?QR_CODE_FG_DARK:QR_CODE_FG_LIGHT }

        />
      </div>
      <SignMessage />
    </div>
  );

}

const mapStateToProps = (state: any, ownProps: any) => ({

  state: state.wallet,
  language: state.lang,
  dialog_status: state.transactionDialogStatus,
  monitore_pending: state.monitore_pending_amount,
  dialog_is_open: state.openTransactionDialog,
  backgroundMode: state.setBackGroundMode,
  walletNumberHasChangedState: state.walletNumberHasChangedState,
  isSignedVerifyWindowClosed: state.verifySignWindowState,
  token: state.tokenState,
  closedChangeWalletState: state.changeWalletWindowState

});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({

  setMyWallet: (param: my_wallet) => dispatch(setMyWallet(param)),
  openDialog: () => dispatch(openWalletDialog()),
  closeDialog: () => dispatch(closeWalletDialog()),
  dialogStatus: (param: string) => dispatch(dialogStatus(param)),
  enablePendingMonitor: (monitorCallback: any) => dispatch(setPendingAmount(monitorCallback)),
  disablePendingMonitor: () => dispatch(clearPendingAmout()),
  newNotification: (msg: NOTIFY_MESSAGE) => dispatch(setNotifyMessage(msg)),
  goBack: () => dispatch(resetWallet()),
  showChangeWalletWindow: () => dispatch(changeWalletWindow(false)),
  walletHasChanged: () => dispatch(walletNumberhasChanged()),
  openSignVerifyWindow: () => dispatch(changeSignVerifyWindow(false))

});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
