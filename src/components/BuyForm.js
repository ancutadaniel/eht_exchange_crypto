import React, { useRef, useState } from "react";
import dacetherLogo from "../../src/token-logo.png";
import ehtLogo from "../../src/eth-logo.png";

export const BuyForm = ({ ethBalance, dacetherBalance, buyDacether }) => {
  const ref = useRef("");
  const [output, setOutput] = useState(0);

  return (
    <form
      className="mb-3"
      onSubmit={(e) => {
        e.preventDefault();
        let etherAmount = ref.current.value.toString();
        etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
        buyDacether(etherAmount);
      }}
    >
      <div>
        <label className="float-left">
          <b>Input</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={() => {
            setOutput(ref.current.value * 100);
          }}
          className="form-control form-control-lg"
          placeholder="0"
          required
          ref={ref}
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ehtLogo} height="32" alt="" />
            EHT
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">
          <b>Output</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(dacetherBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={output}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={dacetherLogo} height="32" alt="" />
            DCTH
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">1 ETH = 100 Dacether</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        {" "}
        Change{" "}
      </button>
    </form>
  );
};
