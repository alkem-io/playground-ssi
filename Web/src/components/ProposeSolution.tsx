import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const ProposeSolution = async () => {
    const account = await getCurrentAccount();
    var form = (document.querySelector("#formuliertje")! as HTMLInputElement).valueOf().toString();
    var Data = String(form);
    window.contract.methods.SolutionsProposed(Data).send({ from: account }).catch((Error: any) => {
        ErrorHandling(Error);
    });
};