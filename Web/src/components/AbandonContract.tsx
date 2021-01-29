import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const AbandonContract = async () => {
    const account = await getCurrentAccount();
    window.contract.methods.ContractAbandoned().send({ from: account }).catch((Error: any) => {
        ErrorHandling(Error);
    });
};