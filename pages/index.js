import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json"; 

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = " 0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const assessmentABI = assessmentABI.abi; // Update the ABI variable name

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };

  const handleAccount = async () => {
    const accounts = await ethWallet.listAccounts();
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.send("eth_requestAccounts", []);
      handleAccount();
      getATMContract();
    } catch (error) {
      console.error(error);
    }
  };

  const getATMContract = () => {
    if (ethWallet) {
      const signer = ethWallet.getSigner();
      const atmContract = new ethers.Contract(
        contractAddress,
        assessmentABI,
        signer
      );
      setATM(atmContract);
    }
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        const depositAmount = ethers.utils.parseEther("1");
        const tx = await atm.deposit({ value: depositAmount });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        const withdrawAmount = ethers.utils.parseEther("1");
        const tx = await atm.withdraw(withdrawAmount);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
