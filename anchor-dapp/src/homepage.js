import './App.css';
import grave from './picture/graves.png'
import {useState} from 'react'
import {Buffer} from 'buffer';
import idl from './user_input.json'
import { Connection, PublicKey, clusterApiUrl  } from '@solana/web3.js';
import { Program, AnchorProvider, web3, } from '@project-serum/anchor';
import * as Web3 from '@solana/web3.js';
const {SystemProgram,Keypair} = web3;
window.Buffer = Buffer
const programID = new PublicKey('7EKbFPopd5FLJqDFKPAHtRcaZTDT53yiGQPu3mZJyvkb') //7EKbFPopd5FLJqDFKPAHtRcaZTDT53yiGQPu3mZJyvkb
//pub key 4CwcxCAB3WgfemijrwFzAWFoNVihScB4D5ufVy78bqhU

const opts = {
  preflightCommitment:"processed",
}


//const network = "http://127.0.0.1:8899";  // for localnet
//const network = clusterApiUrl("devnet") // for devnet
const network = clusterApiUrl("testnet") // for testnet


const new_account = Keypair.generate();
console.log(new_account)

function Homepage() {
  
  const [userInput, setUserInput] = useState("");
  const [walletaddress, setWalletAddress] = useState("");
  const [Tx, setTx] = useState("");
  const [txSig, setTxSig] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [txDone, setTxDone] = useState(false);



  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };


  //connects the wallet to the user
  const connectWallet = async () => {
    if (!window.solana) {
      alert("Solana wallet not found. Please install Sollet or Phantom extension.");
      return;
    }

    try {
      await window.solana.connect();
      const provider = getProvider();
      const walletAddress = provider.wallet.publicKey.toString();
      setWalletAddress(walletAddress);
    } catch (err) {
      console.error("Sorry, but we cannot connect to the wallet:", err);
    }
  };




async function input() {
  const dataAcc = new_account;
  console.log(dataAcc);
  const provider = getProvider();
  const program = new Program(idl, programID, provider);

  try {

    const txSignature = await program.rpc.initialize(userInput, {
      accounts: {
        newAccount: new_account.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [new_account],
    });

    //confirmation for the transaction.
    const confirmation = await provider.connection.confirmTransaction(txSignature, 'confirmed');
    console.log('Transaction Confirmation:', confirmation);

    //the signature for the transaction
    console.log('Transaction Signature:', txSignature);

    setTx(txSignature);
     setTxDone(true)
    const account = await program.account.newAccount.fetch(new_account.publicKey);
    console.log('Output:', account);
  } catch (err) {
    console.error("Transaction Error:", err);
  }
}



  
const findTxRes = async () => {
  try {
    const conn = new Web3.Connection('https://api.testnet.solana.com');
    const fetchedTransaction = await conn.getConfirmedTransaction(txSig);

    if (fetchedTransaction) {
      setTransactionDetails(fetchedTransaction);
    } else {
      console.log('Transaction not found.');
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
};




  document.body.style.backgroundColor = "#dc143c";

  return (

        
    <div className="Website">
      <header className="Website-header">
      <p style={{ fontSize: '48px', color: 'white' }}>Confessional Burial</p>
      <p style={{ fontSize: '32px', color: 'red' }}>"Decentralized Application where you could burrow your secrets."</p>  
      <p style={{ fontSize: '32px', color: 'green' }}>Secrets are meant to be hidden forever</p>
      <p style={{ fontSize: '16px', color: 'green' }}>They are meant to be hidden in a place where only you could read them.</p>    
      <img src={grave} className="App-logo" alt="logo" />
      <button style={{ fontSize: '16px', color: 'green' }} onClick={connectWallet}>Connect Wallet</button>
      <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      <button onClick={input}>Submit Confession</button>
      <p style={{ fontSize: '16px', color: 'green' }}>Address: {walletaddress}</p>
      <p style={{ fontSize: '16px', color: 'white' }}>=============================</p>
      <p style={{ fontSize: '16px', color: 'green' }}>Confession Signature: {Tx}</p> 
        {txDone && (
          <p style={{ fontSize: 'smaller' }}>
            Confession Buried!{' '}
            <a
              href={`https://explorer.solana.com/tx/${Tx}?cluster=testnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Solana Explorer
            </a>
          </p>
        )} 
      <input
            type="text"
            value={txSig}
            onChange={(event) => setTxSig(event.target.value)}
            placeholder="Enter Confession Signature"
          />
          <button onClick={findTxRes}>Dig Confession</button>
   
          {transactionDetails ? (
          <div>
            <h4>Confession Details</h4>
            {transactionDetails.transaction.instructions.length >= 2 ? (
              <div>
                <p>
                  A secret has been uncovered: {' '}
                  <strong>{transactionDetails.transaction.instructions[0].data.slice(8).toString()}</strong>
                </p>
              </div>
            ) : (
              <p>There is no confession data available for the given transaction.</p>
            )}
          </div>
        ) : (
          <p>No transaction data available.</p>
        )}
      </header>
    </div>
  );
}

export default Homepage;
