import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { BuyForm } from "./BuyForm";
import { SellForm } from "./SellForm";

export const Main = ({
  ethBalance,
  dacetherBalance,
  buyDacether,
  sellDacether,
}) => {
  const [current, setCurrent] = useState("buy");

  return (
    <div id="content" className="mt-5">
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-info"
          onClick={() => {
            setCurrent("buy");
          }}
        >
          Buy
        </button>
        <span>&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-info"
          onClick={() => {
            setCurrent("sell");
          }}
        >
          Sell
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          {current === "buy" ? (
            <BuyForm
              ethBalance={ethBalance}
              dacetherBalance={dacetherBalance}
              buyDacether={buyDacether}
            />
          ) : (
            <SellForm
              ethBalance={ethBalance}
              dacetherBalance={dacetherBalance}
              sellDacether={sellDacether}
            />
          )}
        </div>
      </div>
    </div>
  );
};
