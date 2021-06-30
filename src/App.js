import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import "./App.css";
import ListMySubs from "./components/ListMySubs";
import { Button, Layout, Typography } from "antd";

const { Header, Footer, Sider, Content } = Layout;
const { Text, Link } = Typography;
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
			<Header title="Fund approver">
				<Text type="success">Fund Approver</Text>
			</Header>
			<Content>
				{web3React.active ? (
					<ListMySubs />
				) : (
					<Button onClick={ConnectWallet}>Connect Wallet!</Button>
				)}
			</Content>
			<Footer>
				ERC777 Approver ©2021 Created by{" "}
				<Link href="https://twitter.com/themystery" target="_blank">
					Prafful Sahu
				</Link>
			</Footer>
		</Layout>
	);
}

export default App;
