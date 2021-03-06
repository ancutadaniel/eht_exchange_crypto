import React from "react";
import Identicon from "identicon.js";

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
        <ul className="navbar-nav" px-3>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
            </small>
            {account ? (
              <img
                className="ml-2"
                width="30"
                height="30"
                src={`data:image/png;base64,${new Identicon(
                  account,
                  30
                ).toString()}`}
                alt="Dacether"
              />
            ) : (
              <span>No avatar</span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};
