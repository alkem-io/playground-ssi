import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const FetchProposal = async () => {
    const account = await getCurrentAccount();
    var info = await window.contract.methods.ProposalDisplayed().call({
        from: account
    }).catch((error: any) => {
        ErrorHandling(error)
    });
    document.querySelector('#Dinfo')!.innerHTML = info;
};