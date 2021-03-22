import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { NavBar } from "./NavBar";
import { Main } from "./Main";
import EthSwap from "../abis/EthSwap.json";
import Dacether from "../abis/Dacether.json";

import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [dacether, setDacether] = useState({});
  const [ethSwap, setEthSwap] = useState({});
  const [ethBalance, setEthBalance] = useState(0);
  const [dacetherBalance, setDacetherBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // connect app to blockchain
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask"
      );
    }
  };

  // load data from blockchain
  const loadData = async () => {
    const web3 = window.web3;

    const getAccounts = await web3.eth.getAccounts();
    setAccount(getAccounts[0]);

    const eth = await web3.eth.getBalance(getAccounts[0]);
    setEthBalance(eth);

    // Load dacether
    const networkId = await web3.eth.net.getId();
    const dacetherData = Dacether.networks[networkId];
    debugger;
    if (dacetherData) {
      const dacether = new web3.eth.Contract(
        Dacether.abi,
        dacetherData.address
      );
      setDacether(dacether);

      let daceBalance = await dacether.methods.balanceOf(getAccounts[0]).call(); // talk to smart contract and his functions to fetch data from the blockchain

      console.log(daceBalance);

      setDacetherBalance(daceBalance.toString());
    } else {
      window.alert("Dacether contract not deployed to detected network");
    }

    // Load ethSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethData = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      setEthSwap(ethData);
    } else {
      window.alert("EthSwap contract not deployed to detected network");
    }

    setLoading(false);
  };

  const buyDacether = (etherAmount) => {
    setLoading(true);
    ethSwap.methods
      .buyDacether()
      .send({ value: etherAmount, from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  const sellDacether = (dacetherAmount) => {
    setLoading(true);
    dacether.methods
      .approve(ethSwap.address, dacetherAmount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        ethSwap.methods
          .sellDacether(dacetherAmount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  useEffect(() => {
    loadWeb3();
    loadData();
  }, []);

  return (
    <div>
      <NavBar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {loading ? (
                <p id="loader" className="text-center">
                  Loading...
                </p>
              ) : (
                <Main
                  ethBalance={ethBalance}
                  dacetherBalance={dacetherBalance}
                  buyDacether={buyDacether}
                  sellDacether={sellDacether}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
