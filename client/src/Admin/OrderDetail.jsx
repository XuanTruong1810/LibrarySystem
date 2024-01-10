import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
export default function OrderDetail() {
  const { id, status } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const getProductOrder = async () => {
    let response = await axios({
      method: "get",
      url: "http://localhost:5076/api/Manager/GetAllProductOrder",
      params: {
        id,
      },
      withCredentials: true,
    });
    console.log(response.data);
    if (response.data.details) {
      setOrderDetails(response.data);
    }
  };

  useEffect(() => {
    getProductOrder();
  }, []);
  return (
    <div>
      {orderDetails.details === undefined ? (
        <Spin />
      ) : (
        <MDBRow>
          {orderDetails.details.map((orderDetail) => {
            return (
              <MDBCol sm="3">
                <MDBCard>
                  <div
                    style={{
                      width: 300,
                    }}
                  >
                    <MDBCardImage
                      style={{
                        width: "100%",
                      }}
                      src={`http://localhost:5076/Products/Image/${orderDetail.ImageUrl}`}
                    />
                  </div>
                  <MDBCardBody>
                    <MDBCardTitle>{orderDetail.NameProduct}</MDBCardTitle>
                    <MDBCardText>
                      Số lượng : {orderDetail.QuantityOrdered}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
      )}

      <div
        style={{
          textAlign: "end",
        }}
      >
        {orderDetails.Reason && orderDetails.Total ? (
          <>
            <p>
              Tổng tiền phạt:{" "}
              {Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(orderDetails.Total)}{" "}
            </p>
            <p>Nội dung phạt: {orderDetails.Reason} </p>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
