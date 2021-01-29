import { useHistory } from "react-router-dom";
import logo from "../Images/logo.png";


declare global {
    interface Window {
      ethereum: any;
      web3: any;
      contract: any;
    }
}

export const Home = () => {
    
    var page: string = '';

    const history = useHistory();
    const Check  = async () => {
        const accounts = await window.web3.eth.getAccounts();

        if(accounts[0] == '0x259fF8f10E98dc30AFEf489095f88e0b9A9028ac'){
            page =  '/Client';
            history.push(page);
        }
        else if(accounts[0] == '0xF9C84A2E1a9AFfF08785b2bCc8BD1519B2C86BAe'){
            page = '/Deliverer';
            history.push(page);
        }
        else{
            alert('Please connect with the right account associated with a cherrytwist project!')

        }
    }

    window.addEventListener('load', Check);

    return (
      <main className="App"> 
        <div className="header">
            <header> 
                <img src={logo} id="logo"/>
            </header>
        </div>
      </main>
    )
}