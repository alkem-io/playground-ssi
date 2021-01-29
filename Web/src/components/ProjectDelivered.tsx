import { ErrorHandling } from "./ErrorHandling";

const getCurrentAccount = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

export const ProjectDelivered = async () => {
    const account = await getCurrentAccount();
    window.contract.methods.ProjectDelivered().send({ from: account }).catch((Error: any) => {
        if(Error){
            alert('Are you sure you are not done?')
        }
    });
};