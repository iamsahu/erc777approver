import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import "./App.css";
import ListMySubs from "./components/ListMySubs";
import { Button, Layout, Typography } from "antd";
import DowngradeToken from "./components/DowngradeToken";

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
					<>
						<ListMySubs />
						<DowngradeToken
							token={"0x12c294107772b10815307c05989dabd71c21670e"}
						/>
						<DowngradeToken
							token={"0x8ef4f0c0753048a39b4bc4eb3f545fdae00618b7"}
						/>
						<DowngradeToken
							token={"0x229c5d13452dc302499b5c113768a0db0c9d5c05"}
						/>
					</>
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
