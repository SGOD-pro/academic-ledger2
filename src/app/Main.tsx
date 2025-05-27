"use client";
import React from "react";
import store from "@/store";
import { Provider } from "react-redux";

import App from "./App";

function Main({ children }: { children: React.ReactNode }) {

	return (
		<Provider store={store}>
			<App>{children}</App>
		</Provider>
	);
}

export default Main;
