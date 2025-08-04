import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

const contractAddress = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS";

export default function Home() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function loadWeb3() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }
    }
    loadWeb3();
  }, []);

  async function listItem() {
    const tx = await contract.listItem("PDF Book", "https://example.com/mybook.pdf", ethers.utils.parseEther("0.01"));
    await tx.wait();
    alert("Item listed!");
  }

  async function buyItem() {
    const tx = await contract.buyItem(1, { value: ethers.utils.parseEther("0.01") });
    await tx.wait();
    alert("Item bought!");
  }

  return (
    <div className="container">
      <h1>LinkMart</h1>
      <button onClick={listItem}>List Item</button>
      <button onClick={buyItem}>Buy Item #1</button>
      <p>Connected wallet: {account}</p>
    </div>
  );
}
