import React, { useEffect, useState } from "react";
import { ProposeSolution } from "../components/ProposeSolution";
import { WorkConfirmed } from "../components/WorkConfirmed";
import { TransferContract } from "../components/TransferContract";
import { AbandonContract } from "../components/AbandonContract";
import { OnLoad } from "../components/OnLoad";
import { Link } from "react-router-dom";

declare global {
    interface Window {
      ethereum: any;
      web3: any;
      contract: any;
    }
}

export const Client = () => {

  if (window.performance.navigation.type == 1) {
      OnLoad();
    } else {
    }

    return (
      <main className="App">
        <div className="header">
            <header>
                <button onClick={() => AbandonContract()} id="Cancel">Abandon project</button>
                <Link to="/">
                    <button>
                        Landing Page
                    </button>
                </Link>
            </header>
        </div>
        <div className="section">
            <section>
                <h2>Client Dashboard</h2>
                <p></p>
            </section>
            <section>
                <h3>Technical Stats</h3>
                <pre id="log"></pre>
                <div id="a1">
                    <p/>
                        Step 1: Propose solutions
                        <br/>
                    <form id="formuliertje">
                        <label>
                            <input name="textje" type="text" placeholder="Enter Proposal"/>
                        </label>
                        <button onClick={() => ProposeSolution()} id="sendProp">Send</button>
                    </form>
                    <p/>
                </div>
                <div id="a5">
                    <p>
                        Step 2: Confirm work received
                        <button onClick={() => WorkConfirmed()} id="confrec">Confirm</button>
                    </p>
                </div>
                <br/>
                <div id="a6">
                    <p>
                        Step 3: Transfer
                        <button onClick={() => TransferContract()} id="trans">Transfer</button>
                    </p>
                </div>
                <div id="a2"></div>
                <div id="a3"></div>
                <div id="a4"></div>
                <div id="a7">
                    <p>
                        Project has been completed! Thank you for using the Cherrytwist platform!
                    </p> 
                </div>        
                <div id="a8">
                    <p>
                        Project has been abandoned by both parties! Hope to see you again on the Cherrytwist platform!
                    </p>
                </div>
            </section>
        </div>
      </main>
    )
}