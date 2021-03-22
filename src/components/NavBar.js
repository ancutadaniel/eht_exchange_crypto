import React from "react";
import Identicon from "identicon.js";
import Blockies from "react-blockies";

export const NavBar = ({ account, ethBalance }) => {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http:/localhost:3000"
          target="_self"
          rel="noopener noreferrer"
        >
          Dacether Swap
        </a>
        <div style={{ display: "flex" }}>
          <p id="account" style={{ color: "#fff", margin: "0" }}>
            {account}
          </p>
          {account ? (
            <Blockies seed={account.toString()} />
          ) : (
            <span>No avatar</span>
          )}
        </div>
      </nav>
    </div>
  );
};
