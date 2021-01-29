import { ErrorHandling } from "./ErrorHandling";
import { LogEvents } from "./LogEvents";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const WorkConfirmed = async () => {
    const account = await getCurrentAccount();
    window.contract.methods.WorkConfirmed().send({ from: account }).catch((Error: any) => {
        ErrorHandling(Error);
    });
};