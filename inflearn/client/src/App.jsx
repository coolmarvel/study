import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import getWeb3 from "./store/getWeb3";

import Main from "./routes/Main";
import MyAnimal from "./routes/My-animal";
import SaleAnimal from "./routes/Sale-animal";

const App = () => {
  const [accounts, setAccounts] = useState();

  const init = async () => {
    try {
      // 네트워크 공급자 및 web3 인스턴스를 가져옵니다.
      const web3 = await getWeb3();
      // web3를 사용하여 사용자 계정을 가져옵니다.
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, [accounts]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" exact element={<Main accounts={accounts} />} />
          <Route
            path="my-animal"
            exact
            element={<MyAnimal accounts={accounts} />}
          />
          <Route
            path="sale-animal"
            exact
            element={<SaleAnimal accounts={accounts} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
