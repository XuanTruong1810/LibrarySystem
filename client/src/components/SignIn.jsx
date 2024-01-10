import React from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import styles from "../User/components/css/CssLocal.module.css";
import LoginWithFacebook from "../User/components/LoginWithFacebook";
import LoginWithGoogle from "../User/components/LoginWithGoogle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function SignIn() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      let response = await axios.post(
        "http://localhost:5076/api/Account/Login",
        {
          Email: values.Email,
          Password: values.Password,
        },
        { withCredentials: true }
      );
      if (response.data) {
        navigate(response.data.roles[0] === "User" ? "/" : "/Admin");
      }
    } catch (error) {
      if (error.response.status === 401) {
        form.setFields([
          {
            name: "Email",
            errors: [error.response.data],
          },
        ]);
        setTimeout(() => {
          form.resetFields();
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.Container}>
        <div>
          <h1 style={{ textAlign: "center" }}>Đăng nhập</h1>
        </div>
        <Form
          form={form}
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            className={styles.FormInput}
            rules={[
              {
                required: true,
                message: "Hãy nhập Email",
                whitespace: true,
              },
              {
                type: "email",
                message: "Không phải định đạng Email",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="Password"
            className={styles.FormInput}
            rules={[
              {
                required: true,
                message: "Hãy nhập password",
              },
              {
                pattern:
                  /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
                message:
                  "Mật khẩu phải tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <div className={styles.remember}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="/ForgotPassword">
                Quên mật khẩu
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <div className={styles.remember}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  width: 180,
                }}
              >
                Đăng nhập
              </Button>
              <div>
                <a href="/SignOut">Đăng ký bây giờ</a>
              </div>
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
