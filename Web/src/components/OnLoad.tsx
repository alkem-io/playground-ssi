import { ErrorHandling } from "./ErrorHandling";
import { LogEvents } from "./LogEvents"
import Web3 from "web3";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const OnLoad = async () => {
    const account = await getCurrentAccount();
    LogEvents(`web3 is present: ${Web3.version}`);
    LogEvents(`Current connected account: ${account}`);
    var CurrentState = await window.contract.methods.CurrentStateReturned().call({
      from: account
    }).catch((error: any) => {
      ErrorHandling(error);
    });
    LogEvents(`Currentstate: ${CurrentState}`);

    if (CurrentState == 7 || CurrentState == 'undefined') {
      for(let i = 1; i < 8; i++){
          (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'none';
          (document.querySelector(`#a8`)! as HTMLElement).style.display = 'block';
      };    
          
    } else if (CurrentState == 6) {
        for(let i = 1; i < 8; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    } else if (CurrentState == 5) {
        for(let i = 1; i < 7; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    } else if (CurrentState == 4) {
        for(let i = 1; i < 6; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    } else if (CurrentState == 3) {
        for(let i = 1; i < 5; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    } else if (CurrentState == 2) {
        for(let i = 1; i < 4; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
        }
    } else if (CurrentState == 1) {
        for(let i = 1; i < 2; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    } else if (CurrentState == 0) {
        for(let i = 1; i < 2; i++){
            (document.querySelector(`#a${i}`)! as HTMLElement).style.display = 'block';
            };
    };
};