import { BrowserRouter, Route, Routes } from "react-router-dom";

import __Layout from "./User/Layout/Layout.jsx";

import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import { theme } from "antd";
import { ListProDuct } from "./User/components/ListProduct";
import { BrandsProduct } from "./User/components/BrandsProduct";
import { ProductSearch } from "./User/components/ProductSearch";
import InfoUser from "./User/components/InfoUser";
import ProductInfo from "./User/components/ProductInfo.jsx";
import HistoryOrder from "./User/components/HistoryOrder.jsx";
import CartDetail from "./User/components/CartDetail.jsx";
import DefaultLayout from "./Admin/DefaultLayout.jsx";
import Account from "./Admin/Account.jsx";
import Products from "./Admin/Products.jsx";
import Orders from "./Admin/Orders.jsx";
import OrderDetail from "./Admin/OrderDetail.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Report from "./Admin/Report.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import LibraryCart from "./Admin/LibraryCart.jsx";

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          // eslint-disable-next-line react/jsx-pascal-case
          element={<__Layout colorBgContainer={colorBgContainer} />}
        >
          <Route
            index
            path="/"
            element={<ListProDuct colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/Product/:key"
            element={<ProductSearch colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/ProductSort/:id"
            element={<ListProDuct colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/Product"
            element={<ListProDuct colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/ProductInfo/:id"
            element={<ProductInfo colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/Brands/:id"
            element={<BrandsProduct colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/Profile"
            element={<InfoUser colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/HistoryOrder"
            element={<HistoryOrder colorBgContainer={colorBgContainer} />}
          ></Route>
          <Route
            path="/Cart"
            element={<CartDetail colorBgContainer={colorBgContainer} />}
          ></Route>
        </Route>

        <Route path="/Admin" element={<DefaultLayout />}>
          <Route index path="/Admin" element={<Account />} />
          <Route index path="/Admin/Products" element={<Products />} />
          <Route index path="/Admin/Orders" element={<Orders />} />
          <Route index path="/Admin/Report" element={<Report />} />
          <Route index path="/Admin/LibraryCart" element={<LibraryCart />} />

          <Route
            index
            path="/Admin/OrderDetail/:id/:status"
            element={<OrderDetail />}
          />
        </Route>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signOut" element={<SignOut />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
