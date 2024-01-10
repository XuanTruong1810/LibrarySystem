import { Avatar, Menu } from "antd";
import {
  AppstoreOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function SiderLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [brands, setBrand] = useState([]);
  const [account, setAccount] = useState({});
  const navigate = useNavigate();
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  useEffect(() => {
    const GetAccount = async () => {
      try {
        var data = await axios.get("http://localhost:5076/api/InfoUser/Get", {
          withCredentials: true,
        });
        setAccount(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAccount();
  }, []);
  useEffect(() => {
    const getBrand = async () => {
      try {
        var data = await axios.get(
          "http://localhost:5076/api/Product/GetBrand"
        );
        setBrand(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBrand();
  }, []);
  let result = [];
  brands.forEach((brand) => {
    result.push(
      getItem(brand.Name_Brand, brand.ID_Brand, undefined, undefined)
    );
  });
  const items = [
    getItem("Trang chủ", "Home", <HomeOutlined />),
    getItem("Tài Khoản", "Profile", <AppstoreOutlined />, [
      getItem("Thông Tin tài khoản", "Info"),
      getItem("Đăng Xuất", "SignOut"),
    ]),
    getItem("Loại sản phẩm", "Brand", <TeamOutlined />, result),
    getItem("Lịch sử đặt hàng", "History", <HistoryOutlined />),
  ];
  const handleItemClick = async (e) => {
    if (e.key === "Home") {
      navigate("/");
    }
    if (e.keyPath[1] === "Profile") {
      if (e.key === "Info") {
        navigate("/Profile");
      }

      if (e.key === "SignOut") {
        try {
          let response = await axios(
            "http://localhost:5076/api/Account/Logout",
            {
              method: "post",
              withCredentials: true,
            }
          );
          if (response) {
            console.log(response);
            navigate("/SignIn");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (e.keyPath[1] === "Brand") {
      navigate(`/Brands/${e.key}`);
    }
    if (e.key === "History") {
      navigate("/HistoryOrder");
    }
  };
  console.log(account);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        className="demo-logo-vertical"
        style={{
          textAlign: "center",
        }}
      >
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          src={
            account.Image && account.Image.length > 13
              ? `${account.Image}`
              : account.Image
              ? `http://localhost:5076/Users/Image/${account.Image}`
              : null
          }
        >
          {account.Image === null && account.UserName.substring(0, 1)}
        </Avatar>
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={["0"]}
        mode="inline"
        onClick={handleItemClick}
        items={items}
      />
    </Sider>
  );
}
