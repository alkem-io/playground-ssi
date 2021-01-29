import React, { useEffect, useState } from "react";
import { ReplyProposal } from "../components/ReplyProposal";
import { ProjectDelivered } from "../components/ProjectDelivered";
import { FetchProposal } from "../components/FetchProposal";
import { AbandonContract } from "../components/AbandonContract";
import { OnLoad } from "../components/OnLoad";
import { Link } from "react-router-dom";
import { TransferContract } from "../components/TransferContract";

declare global {
    interface Window {
      ethereum: any;
      web3: any;
      contract: any;
    }
}

export const Deliverer = () => {

  if (window.performance.navigation.type == 1) {
      OnLoad();
    } else {
    }

    var STATE: boolean;

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
                <h2>Deliverer Dashboard</h2>
                <p></p>
            </section>
            <section>
                <h3>Technical Stats</h3>
                <pre id="log"></pre>
                <br/>
                <div id="a2">
                    <p>
                        Step 1: Fetch proposal
                        <button onClick={() => FetchProposal()} id="Fetch">Fetch</button>
                    <p id="Dinfo"></p>
                    </p>
                </div>
                <div id="a3">
                    <p>
                        Step 2: Accept or deny proposal
                        <button onClick={() => STATE = true} id="Accept">Accept</button>
                        <br/>
                        <br/>
                        <button onClick={() => STATE = false} id="Deny">Deny</button>
                    </p>
                    <br/>
                    <p>
                        Step 3: Send reply to the client
                        <button onClick={() => ReplyProposal(STATE)} id="reply">Send</button>
                    </p>
                </div>
                <br/>
                <div id="a4">
                    <p>
                        Step 4: Confirm project delivery
                        <button onClick={() => ProjectDelivered()} id="confdel">Confirm</button>
                    </p>
                </div>
                <br/>
                <div id="a6">
                    <p>
                        Step 5: Transfer
                        <button onClick={() => TransferContract()} id="trans">Transfer</button>
                    </p>
                </div>
                <div id="a1"></div>
                <div id="a5"></div>
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