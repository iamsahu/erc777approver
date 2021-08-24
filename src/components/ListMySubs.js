import React, { useEffect, useState } from "react";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { gql, useQuery } from "@apollo/client";
import { Typography, Layout, List, Button, Skeleton, Tag } from "antd";
import { Contract } from "@ethersproject/contracts";
import { superTokenABI } from "../helpers/supertokenabi";
import { Form, Input, InputNumber, Modal, notification, Space } from "antd";
import Web3 from "web3";
import FormItemLabel from "antd/lib/form/FormItemLabel";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const mapping = {
	"0x1305f6b6df9dc47159d12eb7ac2804d4a33173c2": "DAIx",
	"0xcaa7349cea390f89641fe306d93591f87595dc1f": "USDCx",
	"0x3ad736904e9e65189c3000c7dd2c8ac8bb7cd4e3": "MATICx",
	"0x27e1e4e6bc79d93032abef01025811b7e4727e85": "ETHx",
	"0x12c294107772b10815307c05989dabd71c21670e": "SDTx",
	"0x8ef4f0c0753048a39b4bc4eb3f545fdae00618b7": "sdam3CRVx",
	"0x229c5d13452dc302499b5c113768a0db0c9d5c05": "BPTx",
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
	const [visible, setVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [tokBalance, setTokBalance] = useState("0");
	const [form] = Form.useForm();
	const [upgrade, setUpgrade] = useState(false);
	const [upgradeValue, setUpgradeValue] = useState(0);
	const [token, settoken] = useState("");
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

	async function downgradeToken(sT) {
		let contractx = new Contract(
			token, //Super Token Address
			superTokenABI,
			web3React.library.getSigner()
		);
		console.log();
		await contractx
			.downgrade(Web3.utils.toWei(sT.toString()))
			.then((response) => {
				// console.log(response);
				// console.log(Web3.utils.fromWei(Web3.utils.toBN(response)));
				// setTokBalance(Web3.utils.fromWei(Web3.utils.toBN(response)));
				console.log("got balance");
				setVisible(false);
				setConfirmLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setVisible(false);
				setConfirmLoading(false);
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

	const showModal = (hell) => {
		console.log(hell);
		settoken(hell);
		setUpgradeValue(0);
		setVisible(true);
	};

	const onOk = () => {
		setConfirmLoading(true);
		form.submit();
	};

	const onCancel = () => {
		setVisible(false);
		setConfirmLoading(false);
	};

	const onFinish = async (values) => {
		console.log("Success:", values);
		//TO DO: Add function to fire a query to handle addition of subscriber data.

		await downgradeToken(values.Amount);
		// setVisible(false);
		// setConfirmLoading(false);
	};

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
								<>
									<Tag color="green">Approved</Tag>
									<Button
										type="primary"
										onClick={() => showModal(item.token.toString())}
									>
										Downgrade {mapping[item.token.toString()]}
									</Button>

									<Modal
										title="Downgrade supertoken"
										visible={visible}
										onOk={onOk}
										onCancel={onCancel}
										confirmLoading={confirmLoading}
									>
										<Form
											form={form}
											layout="vertical"
											name="userForm"
											onFinish={onFinish}
										>
											<Form.Item
												label="Username"
												name="username"
												noStyle
												defaultValue="hello"
												value="hello2"
											>
												{/* <Input
													type="text"
													type="hidden"
													defaultValue="hello3"
													value="hello4"
												/> */}
											</Form.Item>
											<Form.Item
												name="Amount"
												label="Amount"
												rules={[{ required: true }]}
											>
												<Input />
											</Form.Item>
										</Form>
									</Modal>
								</>
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
