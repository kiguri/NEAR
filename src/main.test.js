beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig);
  window.accountId = nearConfig.contractName;
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["get_val"],
    changeMethods: ["increment, decrement, reset"],
    sender: window.accountId,
  });

  window.walletConnection = {
    requestSignIn() {},
    signOut() {},
    isSignedIn() {
      return true;
    },
    getAccountId() {
      return window.accountId;
    },
  };
});

test("get_val", async () => {
  const val = await window.contract.get_val();
  expect(val).toEqual(0);
});
