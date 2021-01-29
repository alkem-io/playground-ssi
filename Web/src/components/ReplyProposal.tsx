import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const ReplyProposal = async (STATE: boolean) => {
    const account = await getCurrentAccount();
    window.contract.methods.ProposalReplied(STATE).send({ from: account }).catch((Error: any) => {
        if(Error){
            ErrorHandling(Error);
        }
    });
};