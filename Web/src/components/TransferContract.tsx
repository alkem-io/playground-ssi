import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const TransferContract = async () => {
    const account = await getCurrentAccount();
    window.contract.methods.ContractTransferred().send({ from: account }).catch((Error: any) => {
        ErrorHandling(Error);
    });
};