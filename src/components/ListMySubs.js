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
	"0x0F1D7C55A2B133E000eA10EeC03c774e0d6796e8": "fUSDCx",
	"0xdF7B8461a1d9f57f12F88d97FC6131E36d302d81": "fTUSDx",
	"0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0": "ETHx",
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
							item.approved ? (
								<></>
							) : (
								[
									<Button
										onClick={ApproveThisSubscription(
											item.token,
											item.indexId,
											item.publisher
										)}
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
