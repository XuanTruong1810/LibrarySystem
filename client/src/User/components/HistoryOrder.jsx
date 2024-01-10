import { Avatar, Collapse, Divider, Empty, List, Space, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { MDBBadge } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
export default function HistoryOrder({ colorBgContainer }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getAllOrder = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Borrowing/History",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        if (response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        if (error.response.status === 404) {
          navigate("/SignIn");
        }
        console.log(error);
      }
    };
    getAllOrder();
  }, []);
  orders.forEach((o) => {
    console.log(o);
  });
  return (
    <div
      style={{
        background: colorBgContainer,
        padding: 20,
        borderRadius: 10,
      }}
    >
      {orders.length < 1 ? (
        <div className="content">
          <Empty description="Bạn chưa có mượn sách" />;
        </div>
      ) : (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {orders.map((order, index) => {
            return (
              <div key={index}>
                <Divider orientation="left">
                  {moment(order.OrderDate).format("DD/MM/YYYY")}
                </Divider>
                {order.Orders.map((or) => {
                  return (
                    <Collapse
                      key={or.OrderId}
                      size="large"
                      items={[
                        {
                          extra: (
                            <Space>
                              {or.Status === 0 && (
                                <MDBBadge color="warning" pill>
                                  Chưa xác nhận
                                </MDBBadge>
                              )}
                              {or.Status === 1 && (
                                <MDBBadge color="primary" pill>
                                  Đã xác nhận
                                </MDBBadge>
                              )}
                              {or.Status === 2 && (
                                <MDBBadge color="success" pill>
                                  Đang mượn sách
                                </MDBBadge>
                              )}
                              {or.Status === 3 && (
                                <MDBBadge color="info" pill>
                                  Đã trả sách
                                </MDBBadge>
                              )}
                              {or.Status === 4 && (
                                <MDBBadge color="danger" pill>
                                  Đã quá hạn
                                </MDBBadge>
                              )}
                            </Space>
                          ),
                          key: "1",
                          label: `Mã đơn hàng ${or.OrderId}`,
                          children: (
                            <List>
                              {or.BorrowingDetails.map((detail) => {
                                return (
                                  <List.Item key={detail.ID_orderDetail}>
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          style={{
                                            width: 250,
                                            height: 150,
                                          }}
                                          shape="square"
                                          src={`http://localhost:5076/Products/Image/${detail.ImageUrl}`}
                                        ></Avatar>
                                      }
                                      title={
                                        <div>
                                          <h3>{detail.ProductName}</h3>
                                        </div>
                                      }
                                      description={
                                        <h4>
                                          Số lượng đặt: {detail.countOrder}
                                        </h4>
                                      }
                                    />
                                  </List.Item>
                                );
                              })}
                            </List>
                          ),
                        },
                      ]}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
