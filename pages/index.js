import { useState } from 'react';
import { ethers } from 'ethers';
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

  // ─── Inline Styles ───────────────────────────────────────────────────────────

  const pageStyle = {
    fontFamily: 'Orbitron, sans-serif',
    background: 'linear-gradient(to bottom, #050509, #0a0a0f)',
    color: '#00ffff',
    minHeight: '100vh',
    height: '100vh',
    margin: 0,
    padding: '40px 20px',
    textAlign: 'center',
    boxSizing: 'border-box',
    width: '100%',
    overflowX: 'hidden',
  };

  const headerStyle = {
    marginBottom: '60px',
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
    fontWeight: '700',
    letterSpacing: '2px',
    textShadow: '0 0 15px #00ffff, 0 0 30px #00ffff33',
    marginBottom: '12px',
  };

  const subtitleStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.1rem',
    color: '#a0f0ffcc',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.5',
  };

  const walletButtonStyle = {
    padding: '14px 32px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: walletConnected ? '#ffffff' : '#00ffff',
    background: walletConnected ? 'rgba(34, 197, 94, 0.25)' : 'rgba(0, 255, 255, 0.12)',
    border: `1px solid ${walletConnected ? '#22c55e' : '#00ffff'}`,
    borderRadius: '12px',
    boxShadow: `0 0 18px ${walletConnected ? '#22c55e66' : '#00ffff44'}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '50px',
  };

  const sectionStyle = {
    background: 'rgba(10, 10, 15, 0.45)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 255, 0.25)',
    borderRadius: '16px',
    padding: '32px',
    margin: '20px auto',
    maxWidth: '600px',
    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.15)',
    transition: 'all 0.4s ease',
  };

  const sectionHeaderStyle = {
    fontSize: '1.6rem',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#00ffff',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    marginBottom: '16px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(0, 255, 255, 0.4)',
    borderRadius: '10px',
    color: '#00ffff',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const actionButtonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
  };

  const listButtonStyle = {
    ...actionButtonStyle,
    background: '#00ffff',
    color: '#000000',
  };

  const buyButtonStyle = {
    ...actionButtonStyle,
    background: '#ff00ff',
    color: '#ffffff',
  };

  const footerStyle = {
    marginTop: '80px',
    fontSize: '0.95rem',
    color: '#a0f0ff88',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Closed Sea 🌊</h1>
        <p style={subtitleStyle}>
          Decentralized marketplace for exclusive digital assets and downloads.
        </p>
      </header>

      <button
        style={{
          ...walletButtonStyle,
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onClick={connectWallet}
      >
        {walletConnected ? '✅ Wallet Connected' : '🔌 Connect Wallet'}
      </button>

      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setShowListForm(!showListForm)}
        >
          <span>📦 List an Item</span>
          <span>{showListForm ? '−' : '+'}</span>
        </div>

        {showListForm && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Asset Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              style={inputStyle}
              type="text"
              placeholder="Download / Content Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Price in EDGEN"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button
              style={listButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
              }}
              onClick={listItem}
            >
              ✅ List Asset
            </button>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div
          style={sectionHeaderStyle}
          onClick={() => setShowBuyForm(!showBuyForm)}
        >
          <span>🛒 Acquire an Asset</span>
          <span>{showBuyForm ? '−' : '+'}</span>
        </div>

        {showBuyForm && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <input
              style={inputStyle}
              type="number"
              placeholder="Item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Price in EDGEN"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
            <button
              style={buyButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
              }}
              onClick={buyItem}
            >
              💳 Purchase Now
            </button>
          </div>
        )}
      </div>

      <footer style={footerStyle}>
        Built on-chain • By Emmanuel Agafie 🌊<br />
        Closed Sea — Where digital ownership meets the future.
      </footer>

      {/* Inline keyframes for fade animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
