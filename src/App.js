import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import "./App.css";
import ListMySubs from "./components/ListMySubs";
import { Button, Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

function App() {
	const web3React = useWeb3React();
	const activateWeb3 = () => {
		web3React.activate(injected, onError, true).catch((err) => {
			console.error(err);
			// debugger;
		});
	};
	const onError = (err) => {
		console.error(err);
		// debugger;
	};
	function handleChainChanged(chainId) {
		window.location.reload();
		activateWeb3();
	}
	function handleAccountsChanged(accounts) {}
	function handleClose() {}
	function handleNetworkChanged() {}
	async function ConnectWallet() {
		activateWeb3();
	}
	return (
		<Layout>
			<Header>Header</Header>
			<Content>
				{web3React.active ? (
					<ListMySubs />
				) : (
					<Button onClick={ConnectWallet}>Connect Wallet!</Button>
				)}
			</Content>
			<Footer>Footer</Footer>
		</Layout>
	);
}

export default App;
