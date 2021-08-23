import React, { useEffect } from "react";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { gql, useQuery } from "@apollo/client";
import { Typography, Layout, List, Button, Skeleton, Tag } from "antd";
import { Table, Space } from "antd";

const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const mapping = {
	"0x745861aed1eee363b4aaa5f1994be40b1e05ff90": "fDAIx",
	"0x0f1d7c55a2b133e000ea10eec03c774e0d6796e8": "fUSDCx",
	"0xdf7b8461a1d9f57f12f88d97fc6131e36d302d81": "fTUSDx",
	"0xa623b2dd931c5162b7a0b25852f4024db48bb1a0": "ETHx",
	"0x12c294107772b10815307c05989DABD71C21670e": "SDTx",
	"0x8ef4F0C0753048a39B4Bc4eB3f545Fdae00618B7": "sdam3CRVx",
};

const GET_RECEIVE_ADDRESS = gql`
	query receiveAddresses($subscriber: Bytes) {
		subscription2S(where: { subscriber: $subscriber }) {
			id
			token
			subscriber
			publisher
			indexId
			userData
			approved
			units
			revoked
		}
	}
`;

function ListMySubs() {
	const web3React = useWeb3React();
	const sf = new SuperfluidSDK.Framework({
		ethers: new Web3Provider(window.ethereum),
	});
	const { loading, error, data } = useQuery(GET_RECEIVE_ADDRESS, {
		variables: {
			subscriber: web3React.account,
		},
	});

	useEffect(() => {
		async function Fun() {
			await sf.initialize();

			console.log("here");
		}
		Fun();
	});
	function ApproveThisSubscription(token, indexId, publisher) {
		sf.ida.approveSubscription({
			superToken: token,
			indexId: indexId,
			publisher: publisher, // the publisher
			sender: web3React.account, // who is receiving the units and sending this tx
		});
	}

	if (loading) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				Loading...
			</Content>
		);
	}

	if (!web3React.active) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			></Content>
		);
	}

	if (error) {
		console.log(error.message);
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			></Content>
		);
	}
	console.log(data);
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<List
				itemLayout="horizontal"
				dataSource={data.subscription2S}
				renderItem={(item) => (
					<List.Item
						actions={
							item.revoked ? (
								<Tag color="red">Revoked</Tag>
							) : item.approved ? (
								<></>
							) : (
								[
									<Button
										onClick={() =>
											ApproveThisSubscription(
												item.token,
												item.indexId,
												item.publisher
											)
										}
									>
										Approve
									</Button>,
								]
							)
						}
					>
						<Skeleton title={false} loading={item.loading} active>
							<List.Item.Meta
								title={"Publisher: " + item.publisher}
								description={"Token: " + mapping[item.token.toString()]}
							/>
							{item.approved ? (
								<Tag color="green">Approved</Tag>
							) : (
								<Tag color="red">Not Approved</Tag>
							)}
						</Skeleton>
					</List.Item>
				)}
			/>
		</Content>
	);
}

export default ListMySubs;
