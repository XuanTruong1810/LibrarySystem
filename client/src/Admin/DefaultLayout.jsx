import React, { useState } from "react";
import {
  AreaChartOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Quản lý tài khoản", "Accounts", <TeamOutlined />),
  getItem("Quản lý Thẻ ", "LibraryCart", <IdcardOutlined />),

  getItem("Quản lý mượn sách", "Orders", <ShoppingCartOutlined />),
  getItem("Quản lý sản phẩm", "Products", <ShopOutlined />),
  getItem("Thống kê", "Report", <AreaChartOutlined />),
  getItem("Đăng Xuất", "SignOut", <LogoutOutlined />),
];

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleItemClick = async (e) => {
    if (e.key === "SignOut") {
      try {
        let response = await axios("http://localhost:5076/api/Account/Logout", {
          method: "post",
          withCredentials: true,
        });
        if (response) {
          console.log(response);
          navigate("/SignIn");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (e.key === "Accounts") {
      navigate(`/Admin/`);
    }
    if (e.key === "Orders") {
      navigate("/Admin/Orders");
    }
    if (e.key === "Products") {
      navigate("/Admin/Products");
    }
    if (e.key === "Report") {
      navigate("/Admin/Report");
    }
    if (e.key === "LibraryCart") {
      navigate("/Admin/LibraryCart");
    }
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleItemClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: "#001529",
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              margin: "16px 0",
            }}
          ></div>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};
export default DefaultLayout;
