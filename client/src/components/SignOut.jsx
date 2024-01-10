import React from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import LoginWithFacebook from "../User/components/LoginWithFacebook";
import LoginWithGoogle from "../User/components/LoginWithGoogle";
import styles from "../User/components/css/CssLocal.module.css";
import { useNavigate } from "react-router-dom";
export default function SignOut() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      let data = await axios.post(
        "http://localhost:5076/api/Account/Register",
        {
          UserName: values.username,
          Email: values.email,
          Password: values.password,
        }
      );
      if (data) {
        navigate("/SignIn");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.Container}>
        <div>
          <h1 style={{ textAlign: "center" }}>Đăng Ký</h1>
        </div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            className={styles.FormInput}
            name="username"
            rules={[
              {
                required: true,
                message: "Bạn chưa nhập UserName!",
              },
            ]}
            hasFeedback
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên người dùng"
            />
          </Form.Item>
          <Form.Item
            name="email"
            className={styles.FormInput}
            rules={[
              {
                type: "email",
                message: "Không phải email",
              },
              {
                required: true,
                message: "Bạn chưa nhập email!",
              },
            ]}
            hasFeedback
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              type="email"
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            className={styles.FormInput}
            name="password"
            rules={[
              {
                required: true,
                message: "Bạn chưa nhập mật khẩu",
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
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item
            name="ConfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Nhập lại mật khẩu bắt buộc nhập",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không trùng khớp"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className={styles.button}
                size="large"
              >
                Đăng ký
              </Button>

              <span style={{ textAlign: "right" }}>
                <a style={{ fontSize: 16 }} href="/SignIn">
                  Đăng nhập bây giờ
                </a>
              </span>
            </div>
          </Form.Item>
        </Form>
        <div className={styles.divLoginOrders}>
          <LoginWithFacebook styleButton={styles.button} />
          <LoginWithGoogle styleButton={styles.button} />
        </div>
      </div>
    </div>
  );
}
