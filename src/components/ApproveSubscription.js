import React, { useEffect } from "react";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { gql, useQuery } from "@apollo/client";

const GET_SUBSCRIPTIONS = gql`
	query subscriber($subscriberAddress: Bytes) {
		subscriberEntities(where: { subscriberAddress: $subscriberAddress }) {
			id
			subscriberAddress
			index
			tokenAddress
			publisher
			name
		}
	}
`;

function ApproveSubscription(params) {
	const web3React = useWeb3React();
	const sf = new SuperfluidSDK.Framework({
		ethers: new Web3Provider(window.ethereum),
	});

	const { loading, error, data } = useQuery(GET_SUBSCRIPTIONS, {
		variables: {
			subscriberAddress: web3React.account,
		},
	});

	useEffect(() => {
		async function Fun() {
			await sf.initialize();

			console.log("here");
		}
		Fun();
	});

	function ApproveThisSubscription(indexId, publisher) {
		sf.ida.approveSubscription({
			superToken: "0x745861aed1eee363b4aaa5f1994be40b1e05ff90",
			indexId: indexId,
			publisher: publisher, // the publisher
			sender: web3React.account, // who is receiving the units and sending this tx
		});
	}

	if (loading) {
		return <div>Loading</div>;
	}
	if (error) {
		console.log(error.message);
		return <div>SOmething went wrong</div>;
	}
	console.log(data);
	return <div></div>;
}

export default ApproveSubscription;
