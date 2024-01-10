import { message } from "antd";
import axios from "axios";
import { MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CartLibrary() {
  const [check, setCheck] = useState();
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      let response = await axios(
        "http://localhost:5076/api/ReqCart/RequestCart",
        {
          method: "post",
          withCredentials: true,
        }
      );
      if (response.data) {
        message.success("Yêu cầu cấp thẻ vật lý thành công");
        setCheck(response.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/SignIn");
      }
    }
  };
  useEffect(() => {
    const checkCart = async () => {
      try {
        let response = await axios(
          "http://localhost:5076/api/ReqCart/CheckCart",
          {
            method: "Get",
            withCredentials: true,
          }
        );
        if (response.data >= 0) {
          setCheck(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkCart();
  }, [check]);

  return (
    <div>
      {check !== undefined ? (
        <>
          <MDBBtn
            disabled={check > 0}
            onClick={handleClick}
            style={{
              position: "relative",
              top: "-25px",
            }}
          >
            Yêu cầu cấp thẻ vật lý
          </MDBBtn>
          <MDBBadge
            color="danger"
            light
            pill
            className="position-absolute translate-middle"
          >
            {check === 0
              ? "Chưa yêu cầu cấp thẻ"
              : check === 1
              ? "Chưa xác nhận"
              : check === 2
              ? "Đã xác nhận"
              : check === 3
              ? "Đã nhận thẻ"
              : "Thẻ quá hạn"}
            <span class="visually-hidden">unread messages</span>
          </MDBBadge>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
