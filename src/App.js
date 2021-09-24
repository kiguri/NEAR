import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "./utils";
import "./global.css";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  const [value, setValue] = React.useState();
  const [showNotification, setShowNotification] = React.useState(false);
  const [action, setAction] = React.useState("");

  React.useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      window.contract.get_val().then((valueFromContract) => {
        setValue(valueFromContract);
      });
    }
  }, []);

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects to a
          test network ("testnet") wallet. This works just like the main network
          ("mainnet") wallet, but the NEAR Tokens on testnet aren't convertible
          to other currencies – they're just for testing!
        </p>
        <p>Go ahead and click the button below to try it out:</p>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  async function onClickAdd() {
    setShowNotification(false);
    setAction("increment");
    try {
      await window.contract.increment();
    } catch (error) {
      alert(
        "Something went wrong! " +
          "Maybe you need to sign out and back in? " +
          "Check your browser console for more info."
      );
      throw error;
    }
    window.contract.get_val().then((valueFromContract) => {
      setValue(valueFromContract);
    });

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 11000);
  }

  async function onClickMinus() {
    setShowNotification(false);
    setAction("decrement");
    try {
      await window.contract.decrement();
    } catch (error) {
      alert(
        "Something went wrong! " +
          "Maybe you need to sign out and back in? " +
          "Check your browser console for more info."
      );
      throw error;
    }
    window.contract.get_val().then((valueFromContract) => {
      setValue(valueFromContract);
    });

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 11000);
  }

  async function onClickReset() {
    setShowNotification(false);
    setAction("reset");
    try {
      await window.contract.reset();
    } catch (error) {
      alert(
        "Something went wrong! " +
          "Maybe you need to sign out and back in? " +
          "Check your browser console for more info."
      );
      throw error;
    }
    window.contract.get_val().then((valueFromContract) => {
      setValue(valueFromContract);
    });

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 11000);
  }

  return (
    <>
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="accountID"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)",
            }}
          >
            AccountID:
          </label>{" "}
          {window.accountId}!
        </h1>

        <fieldset id="fieldset">
          <label
            htmlFor="counter"
            style={{
              display: "block",
              color: "var(--gray)",
              marginBottom: "0.5em",
            }}
          >
            Value:
            <span>{value}</span>
          </label>
          <div>
            <button className="btn" onClick={onClickMinus}>
              Minus
            </button>
            <button className="btn" onClick={onClickAdd}>
              Add
            </button>
            <button className="btn" onClick={onClickReset}>
              Reset
            </button>
          </div>
        </fieldset>
      </main>
      {showNotification && <Notification action={action} />}
    </>
  );
}

function Notification({ action }) {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>{" "}
      called method: "{action}" in contract:{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
