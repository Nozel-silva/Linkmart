import { useState } from 'react';
import { ethers } from 'ethers';

// ─── Add this line (adjust the path if your global.css is in a different folder) ───
import '../styles/globals.css';   // or './global.css' or '@/styles/global.css' — match your folder structure

const contractAddress = '0xc979F91746132cA63C027AbfD04273fbE2ad4501';

// Assume contractABI is defined somewhere — add it if missing
const contractABI = [ /* your ABI array here */ ];

export default function Home() {
  const [showListForm, setShowListForm] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  const [itemId, setItemId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  // Your original logic (unchanged)
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
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
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

  return (
    <>
      <div className="bg-glow" />

      <div className="container">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wide text-neon-cyan">
            Closed Sea <span style={{ color: 'var(--cyber-magenta)' }}>🌊</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', marginTop: '1rem', fontSize: '1.2rem', color: '#a0f0ffcc', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Decentralized marketplace for exclusive digital downloads and assets.
          </p>
        </header>

        <div className="flex justify-center mb-12">
          <button
            onClick={connectWallet}
            className={`btn-neon btn-connect px-10 py-4 text-lg ${walletConnected ? 'bg-green-700/70 border-green-400 text-white' : ''}`}
          >
            {walletConnected ? '✅ Wallet Connected' : '🔌 Connect Wallet'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* List Section */}
          <div className="glass-card p-8">
            <div className="section-header" onClick={() => setShowListForm(!showListForm)}>
              <span>📦 List an Item</span>
              <span>{showListForm ? '−' : '+'}</span>
            </div>

            {showListForm && (
              <div className="space-y-5 animate-fade-in mt-6">
                <input
                  type="text"
                  placeholder="Asset Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Download / Content Link"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Price in EDGEN"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="input-field"
                />
                <button onClick={listItem} className="btn-neon btn-list w-full">
                  ✅ List Asset
                </button>
              </div>
            )}
          </div>

          {/* Buy Section */}
          <div className="glass-card p-8">
            <div className="section-header" onClick={() => setShowBuyForm(!showBuyForm)}>
              <span>🛒 Acquire an Asset</span>
              <span>{showBuyForm ? '−' : '+'}</span>
            </div>

            {showBuyForm && (
              <div className="space-y-5 animate-fade-in mt-6">
                <input
                  type="number"
                  placeholder="Item ID"
                  value={itemId}
                  onChange={e => setItemId(e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Price in EDGEN"
                  value={buyPrice}
                  onChange={e => setBuyPrice(e.target.value)}
                  className="input-field"
                />
                <button onClick={buyItem} className="btn-neon btn-buy w-full">
                  💳 Purchase Now
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-20 text-gray-500 text-sm">
          <p>Built on-chain • By Emmanuel Agafie 🌊</p>
          <p style={{ marginTop: '0.5rem' }}>Closed Sea — Ownership meets the future.</p>
        </footer>
      </div>
    </>
  );
      }
