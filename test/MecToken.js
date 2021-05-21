var MecToken = artifacts.require("./MecToken.sol");


contract('MecToken', function(accounts){
    var tokenInstance;

    it('initialises the contract with the correct values', function(){
        return MecToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'Mec Token','has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'mTok', 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'Mec Token v1.0','has correct standard');
        });
    })


    it('allocates the initial supply upon deploymnet', function() {
        return MecToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000,'sets the total supply to 1,000,000')
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to admin account');
        });
    });

    it('transfers token ownership',function(){
        return MecToken.deployed().then(function(instance){
            tokenInstance = instance;
            //Test 'require ' statement first by transferening something larger than sender's balance
            return tokenInstance.transfer.call(accounts[1],99999999999999);

        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert')>=0, 'error message must contain revert');
            return tokenInstance.transfer.call( accounts[1], 250000, {from: accounts[0]} );
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);

        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the recieving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000,'deducts the amount from the sending accout');
        });
    });

    it('approves tokens for delegated transfer', function() {
        return MecToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorised by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorised to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
        });
    });

});