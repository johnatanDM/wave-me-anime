import React, { useEffect, useState  } from "react";
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const wave = () => {
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  /*
    * This runs our function when the page loads.
    */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Me manda um olá 🖐
        </div>

        <div className="bio">
          <p>Olá, sou o Baguete.</p>
          <p>Conecte sua carteira Ethereum e me manda uma mensagem legal!</p>
          <p>💰 Você poderá ganhar algum ETH. 💲</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Me conta ai
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
      </div>
    </div>
  );
}

export default App;
