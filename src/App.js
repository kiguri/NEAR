import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "./utils";
import { Button, Box, Card, Container } from "@mui/material";
import "./global.css";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

function Transactions(props) {}

function CashTransfer(props) {}

export default function App() {
  const isSignedIn = window.walletConnection.isSignedIn();

  if (!isSignedIn) {
    <div className="app">
      <Container maxWidth="sm">
        <Button>Login</Button>
      </Container>
    </div>;
  }

  return (
    <div className="app">
      <Container maxWidth="sm">Hello</Container>
    </div>
  );
}
