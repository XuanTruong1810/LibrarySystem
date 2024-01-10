import {
  Avatar,
  Badge,
  Col,
  Empty,
  InputNumber,
  List,
  Popover,
  Row,
  Space,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { ShoppingTwoTone, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import RemoveCart from "../components/RemoveCart.jsx";
import UpdateCart from "../components/UpdateCart";
import { MDBBtn } from "mdb-react-ui-kit";
import CartLibrary from "../components/CartLibrary.jsx";

export default function HeaderLayout({ colorBgContainer }) {
  const [carts, setCart] = useState([]);
  const [quality, setQuality] = useState(1);

  useEffect(() => {
    const getCart = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Cart/GetCart",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setCart(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCart();
  }, [carts]);
  const data = [];
  carts.forEach((cart) => {
    data.push({
      title: cart.NameProduct,
      Image: cart.Image,
      Quality: cart.Quality,
      id: cart.Id_Product,
    });
  });
  const handleOnchangeCart = (value) => {
    setQuality(value);
  };
  return (
    <Header
      style={{
        height: 70,
        padding: 15,
        background: colorBgContainer,
      }}
    >
      <Row
        gutter={16}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <CartLibrary />
        </Col>

        <Col>
          <Space
            style={{
              position: "relative",
              top: "-14px",
            }}
          >
            <div>
              <Popover
                trigger="click"
                size="large"
                placement="right"
                title={
                  <h2
                    style={{
                      color: "yellowgreen",
                      textAlign: "center",
                    }}
                  >
                    Giỏ hàng của bạn
                  </h2>
                }
                overlayStyle={{
                  width: "24vw",
                  cursor: "pointer",
                }}
                content={
                  <div>
                    <List
                      style={{
                        maxHeight: 500,
                        overflow: "auto",
                      }}
                      locale={{
                        emptyText: <Empty description="Không có sản phẩm" />,
                      }}
                      itemLayout="horizontal"
                      dataSource={data}
                      renderItem={(item, index) => (
                        <div>
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  shape="square"
                                  size="large"
                                  src={`http://localhost:5076/Products/Image/${item.Image}`}
                                />
                              }
                              title={<p>{item.title}</p>}
                              description={
                                <div>
                                  <div>
                                    <span style={{ marginRight: "8px" }}>
                                      Số lượng
                                    </span>
                                    <InputNumber
                                      onChange={handleOnchangeCart}
                                      size="small"
                                      defaultValue={item.Quality}
                                    />
                                  </div>
                                </div>
                              }
                            />
                            <Space>
                              <UpdateCart
                                ProductId={item.id}
                                quality={quality}
                              />
                              <RemoveCart ProductId={item.id} />
                            </Space>
                          </List.Item>
                        </div>
                      )}
                    />
                    <div style={{ textAlign: "center" }}>
                      <Link to="/Cart" style={{ fontSize: 17 }}>
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                }
              >
                <Badge count={carts.length}>
                  <Avatar
                    style={{ cursor: "pointer" }}
                    shape="square"
                    size="large"
                    icon={<ShoppingTwoTone />}
                  ></Avatar>
                </Badge>
              </Popover>
            </div>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
