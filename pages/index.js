import { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json'; // ✅ Make sure ABI is present and valid

const contractAddress = '0xc979F91746132cA63C027AbfD04273fbE2ad4501';

export default function Home() {
  const [showListForm, setShowListForm] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  const [itemId, setItemId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        alert('Wallet connected!');
      } catch (error) {
        alert('Connection failed');
        console.error(error);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const connectToContract = () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      return contract;
    } catch (err) {
      console.error("Contract connection error:", err);
      return null;
    }
  };

  const listItem = async () => {
    if (!walletConnected) return alert("Please connect wallet first!");
    try {
      const contract = connectToContract();
      if (!contract) throw new Error("Contract not loaded");
      const tx = await contract.listItem(title, link, ethers.utils.parseEther(price));
      await tx.wait();
      alert('Item listed successfully!');
    } catch (err) {
      console.error(err);
      alert('Error listing item: ' + err.message);
    }
  };

  const buyItem = async () => {
    if (!walletConnected) return alert("Please connect wallet first!");
    try {
      const contract = connectToContract();
      if (!contract) throw new Error("Contract not loaded");
      const tx = await contract.buyItem(itemId, { value: ethers.utils.parseEther(buyPrice) });
      await tx.wait();
      alert('Item purchased successfully!');
    } catch (err) {
      console.error(err);
      alert('Error purchasing item: ' + err.message);
    }
  };

  // 🔧 Styling (same as before)
  const containerStyle = {
    fontFamily: 'Orbitron, sans-serif',
    backgroundColor: '#0e0e0e',
    color: '#0ff',
    minHeight: '100vh',
    padding: '40px',
    textAlign: 'center',
  };

  const inputStyle = {
    margin: '10px',
    padding: '10px',
    width: '80%',
    maxWidth: '400px',
    fontSize: '16px',
    backgroundColor: '#1f1f1f',
    color: '#0ff',
    border: '1px solid #0ff',
    borderRadius: '8px',
  };

  const buttonStyle = {
    margin: '15px',
    padding: '12px 20px',
    fontSize: '16px',
    color: '#000',
    background: '#0ff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 0 15px #0ff',
    cursor: 'pointer',
  };

  const formWrapper = {
    marginTop: '20px',
    marginBottom: '40px',
    border: '1px solid #0ff',
    padding: '20px',
    borderRadius: '12px',
    background: '#111',
    boxShadow: '0 0 20px #0ff5',
    display: 'inline-block',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '36px', textShadow: '0 0 10px #0ff' }}>🚀 Web3 Marketplace project by Emmanuel Agafie  </h1>

      <button style={buttonStyle} onClick={connectWallet}>
        {walletConnected ? '✅ Wallet Connected' : '🔌 Connect Wallet'}
      </button>

      <button style={buttonStyle} onClick={() => setShowListForm(!showListForm)}>
        {showListForm ? '🔽 Hide Listing Form' : '📦 List an Item'}
      </button>

      {showListForm && (
        <div style={formWrapper}>
          <input style={inputStyle} type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} /><br />
          <input style={inputStyle} type="text" placeholder="Download Link" onChange={e => setLink(e.target.value)} /><br />
          <input style={inputStyle} type="number" placeholder="Price in EDGEN" onChange={e => setPrice(e.target.value)} /><br />
          <button style={buttonStyle} onClick={listItem}>✅ Submit Listing</button>
        </div>
      )}

      <button style={buttonStyle} onClick={() => setShowBuyForm(!showBuyForm)}>
        {showBuyForm ? '🔽 Hide Buy Form' : '🛒 Buy an Item'}
      </button>

      {showBuyForm && (
        <div style={formWrapper}>
          <input style={inputStyle} type="number" placeholder="Item ID" onChange={e => setItemId(e.target.value)} /><br />
          <input style={inputStyle} type="number" placeholder="Price in EDGEN" onChange={e => setBuyPrice(e.target.value)} /><br />
          <button style={buttonStyle} onClick={buyItem}>💳 Submit Purchase</button>
        </div>
      )}
    </div>
  );
    }
    
