import { Form, message } from "antd";
import axios from "axios";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import React from "react";

export default function ForgotPassword() {
  const onFinish = async (values) => {
    try {
      let response = await axios({
        url: "http://localhost:5076/api/Account/ForgotPassword",
        params: {
          Email: values.email,
        },
        method: "post",
      });

      if (response.data) {
        message.success("Kiểm tra Email để thay đổi mật khẩu");
      }
    } catch (error) {
      message.error("Không tìm thấy Email");
      console.log(error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 50,
      }}
    >
      <div
        style={{
          width: 500,
        }}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Hãy nhập Email!",
              },
            ]}
            hasFeedback
          >
            <MDBInput label="Email" id="form1" type="text" />
          </Form.Item>
          <Form.Item>
            <MDBBtn htmlType="submit">Nhập Email</MDBBtn>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
