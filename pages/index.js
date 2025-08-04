import { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

export default function Home() {
  const [showListForm, setShowListForm] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  const [itemId, setItemId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const connectToContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const listItem = async () => {
    const contract = connectToContract();
    const tx = await contract.listItem(title, link, ethers.utils.parseEther(price));
    await tx.wait();
    alert('Item listed successfully!');
  };

  const buyItem = async () => {
    const contract = connectToContract();
    const tx = await contract.buyItem(itemId, { value: ethers.utils.parseEther(buyPrice) });
    await tx.wait();
    alert('Item purchased successfully!');
  };

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
      <h1 style={{ fontSize: '36px', textShadow: '0 0 10px #0ff' }}>🚀 Web3 Marketplace</h1>

      <button style={buttonStyle} onClick={() => setShowListForm(!showListForm)}>
        {showListForm ? '🔽 Hide Listing Form' : '📦 List an Item'}
      </button>

      {showListForm && (
        <div style={formWrapper}>
          <input style={inputStyle} type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} /><br />
          <input style={inputStyle} type="text" placeholder="Download Link" onChange={e => setLink(e.target.value)} /><br />
          <input style={inputStyle} type="number" placeholder="Price in ETH" onChange={e => setPrice(e.target.value)} /><br />
          <button style={buttonStyle} onClick={listItem}>✅ Submit Listing</button>
        </div>
      )}

      <button style={buttonStyle} onClick={() => setShowBuyForm(!showBuyForm)}>
        {showBuyForm ? '🔽 Hide Buy Form' : '🛒 Buy an Item'}
      </button>

      {showBuyForm && (
        <div style={formWrapper}>
          <input style={inputStyle} type="number" placeholder="Item ID" onChange={e => setItemId(e.target.value)} /><br />
          <input style={inputStyle} type="number" placeholder="Price in ETH" onChange={e => setBuyPrice(e.target.value)} /><br />
          <button style={buttonStyle} onClick={buyItem}>💳 Submit Purchase</button>
        </div>
      )}
    </div>
  );
}
