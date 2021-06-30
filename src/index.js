import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const client = new ApolloClient({
	uri: process.env.REACT_APP_GRAPHQL, //"http://localhost:8000/subgraphs/name/iamsahu/idatest",
	cache: new InMemoryCache(),
});

function getLibrary(provider, connector) {
	// return new ethers.providers.Web3Provider(window.ethereum);
	const test = new Web3Provider(provider);

	return test; // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
	<Web3ReactProvider getLibrary={getLibrary}>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</Web3ReactProvider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
