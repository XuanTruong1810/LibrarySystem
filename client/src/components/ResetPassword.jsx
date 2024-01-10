import { Form, message } from "antd";
import axios from "axios";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const token = new URLSearchParams(location.search).get("token");
    const email = new URLSearchParams(location.search).get("email");
    try {
      let response = await axios({
        url: "http://localhost:5076/api/Account/Resetpassword",
        method: "post",
        params: {
          Password: values.password,
          token,
          email,
        },
      });

      if (response.data) {
        message.success("Cập nhật mật khẩu thành công");
        navigate("/SignIn");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 10,
      }}
    >
      <div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                pattern:
                  /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
                message:
                  "Mật khẩu phải tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!",
              },
            ]}
            hasFeedback
          >
            <MDBInput label="Mật khẩu" id="form1" type="text" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Nhập lại mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Hãy nhập lại mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <MDBInput label="Nhập lại mật khẩu" id="form1" type="text" />
          </Form.Item>
          <Form.Item>
            <MDBBtn htmlType="submit">Cập nhật mật khẩu</MDBBtn>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
