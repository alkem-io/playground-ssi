import Web3 from "web3";
import contract from "../contractdata/Contract.json";

const contractAddress = '0x609E197fC277e8853aC94F0626F6fb776B3B28F2'; 

const contractABI = () => {
  const abi = contract.abi;
  return abi; 
}

const startWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else {
    window.alert("Metamask not detected!");
  }
};

const loadContract = async () => {
  return await new window.web3.eth.Contract(contractABI(), contractAddress);
};

export const LoadWeb3 = async () => {
  await startWeb3();
  window.contract = await loadContract();
};