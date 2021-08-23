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
	"0x1305f6b6df9dc47159d12eb7ac2804d4a33173c2": "DAIx",
	"0xcaa7349cea390f89641fe306d93591f87595dc1f": "USDCx",
	"0x3ad736904e9e65189c3000c7dd2c8ac8bb7cd4e3": "MATICx",
	"0x27e1e4e6bc79d93032abef01025811b7e4727e85": "ETHx",
	"0x12c294107772b10815307c05989dabd71c21670e": "SDTx",
	"0x8ef4f0c0753048a39b4bc4eb3f545fdae00618b7": "sdam3CRVx",
};

const GET_RECEIVE_ADDRESS = gql`
	query receiveAddresses($subscriber: Bytes) {
		subscribers(where: { subscriber: $subscriber }) {
			token
			indexId
			approved
			revoked
			publisher
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
				dataSource={data.subscribers}
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
								title={
									item.publisher == "0xd6fb1f82ff2296b55bddffcce80abde7fbc6c22d"
										? "Publisher: StakeDAO"
										: "Publisher: " + item.publisher
								}
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
