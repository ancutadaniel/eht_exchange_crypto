const { assert } = require("chai");

const EthSwap = artifacts.require("EthSwap");
const Dacether = artifacts.require("Dacether");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("EthSwap", ([deployer, investor]) => {
  let daceTokens, ethSwap;
  before(async () => {
    daceTokens = await Dacether.new();
    ethSwap = await EthSwap.new(daceTokens.address);
    // Transfer all tokens to EthSwap 1 million
    await daceTokens.transfer(ethSwap.address, tokensCovert("1000000"));
  });

  const tokensCovert = (n) => {
    return web3.utils.toWei(n, "ether");
  };

  describe("Dacether development", async () => {
    it("contract has a name", async () => {
      let dacether = await Dacether.new();
      const name = await dacether.name();
      assert.equal(name, "Dacether");
    });

    it("contract has a symbol", async () => {
      let dacether = await Dacether.new();
      const symbol = await dacether.symbol();
      assert.equal(symbol, "DCTH");
    });
  });

  describe("EthSwap development", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has a symbol", async () => {
      const symbol = await ethSwap.symbol();
      assert.equal(symbol, "ETH");
    });

    it("contract has a dacether transfer to EthSwap S.C", async () => {
      let balance = await daceTokens.balanceOf(ethSwap.address);

      assert.isNotEmpty(balance);
      assert.equal(balance.toString(), tokensCovert("1000000"));
    });
  });

  describe("Buy dacether", async () => {
    let result;

    before(async () => {
      // Purchase dacether before each example
      result = await ethSwap.buyDacether({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });

    it("Allow user to instantly buy dacether from ethSwap for a fixed price", async () => {
      // Check investor balance after purchase dacether
      let investorBalance = await daceTokens.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokensCovert("100"));

      // Check ethSwap balance after purchase
      let ethSwapBalance = await daceTokens.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokensCovert("999900"));

      // Check EHT balance went up
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "ether"));

      console.log(result.logs);

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.dacether, daceTokens.address);
      assert.equal(event.amount.toString(), tokensCovert("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("Sell dacether", async () => {
    let result;

    before(async () => {
      // to be able to sell first we need to approve by the investor
      await daceTokens.approve(ethSwap.address, tokensCovert("100"), {
        from: investor,
      });

      //  investor sell the dacether
      result = await ethSwap.sellDacether(tokensCovert("100"), {
        from: investor,
      });
    });

    it("Allow user to instantly sell dacether to ethSwap for a fixed price", async () => {
      // Check investor balance after purchase dacether
      let investorBalance = await daceTokens.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokensCovert("0"));

      // Check ethSwap balance after purchase
      let ethSwapBalance = await daceTokens.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokensCovert("1000000"));

      // Check EHT balance went up
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("0", "ether"));

      console.log(result.logs);

      // check that the event was emitted with the correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.dacether, daceTokens.address);
      assert.equal(event.amount.toString(), tokensCovert("100").toString());
      assert.equal(event.rate.toString(), "100");

      // FAILURE investor can't sale more dacether that they have
      await ethSwap.sellDacether(tokensCovert("500"), {
        from: investor,
      }).should.be.rejected;
    });
  });
});
