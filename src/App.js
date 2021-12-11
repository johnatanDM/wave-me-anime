import React, { useEffect, useState  } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import load from './assets/load.gif'

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState("");
  const [countWave, setCountWave] = useState(0);
  const [message, setMessage] = useState("");

  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0xC1fE135AfB7e1317fE43aD3Bdb31Db07d183C245";
  const contractABI = abi.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      if (ethereum) {
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);
        setMining(true);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setMining(false);
        updateCountWave();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
  }
  
  const updateCountWave = async () => {
    let count = await wavePortalContract.getTotalWaves();
    setCountWave(count.toNumber());
    console.log("Retrieved total wave count...", count.toNumber());
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        getAllWaves();
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
    updateCountWave();
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

        <div className="contador">
          <p>Já foram enviados {countWave} 🖐</p>
        </div>
        
        {mining && (
          <img src={load} alt="loading..." />
        )}

        {/*
        * If there is no currentAccount render this button
      */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
              Conectar carteira.
          </button>
        )}

        {currentAccount && (
          <form onSubmit={handleSubmit}>
            <input
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="waveButton" onClick={wave}>
              Enviar
            </button>
          </form>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App;
