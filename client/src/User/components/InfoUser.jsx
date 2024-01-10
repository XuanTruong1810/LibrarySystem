import React, { useEffect } from "react";
import "../components/css/CSSProfile.css";
import {
  Avatar,
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Select,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function InfoUser({ colorBgContainer }) {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [userName, setUseName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [cartID, setCartID] = useState("");

  const [componentDisabled, setComponentDisabled] = useState(true);

  const onFinish = async (values) => {
    try {
      let response = await axios.post(
        "http://localhost:5076/api/Upload/UploadFile",
        {
          UserName: values.username,
          Telephone: values.telePhone,
          Gender: values.gender,
          Birthday: values.birthday.format("YYYY-MM-DD"),
        },
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        notification.success({
          message: "Cập nhật dữ liệu",
          description: "Thành công",
          duration: 1,
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    setComponentDisabled(true);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleEnable = () => {
    setComponentDisabled(false);
  };
  const handleChange = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://localhost:5076/api/Upload/UploadImage",
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        console.log(response);
        setImage(response.Image);
        message.success(`Cập nhật ảnh thành công`);
        onSuccess();
      } else {
        message.error(`Cập nhật ảnh thất bại`);
        onError();
      }
    } catch (error) {
      console.error("Error during upload:", error);
      onError();
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/InfoUser/Get",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          console.log(response.data);
          setUseName(response.data.UserName);
          setPhoneNumber(response.data.PhoneNumber);
          setEmail(response.data.Email);
          setBirthday(response.data.Birthday);
          setGender(response.data.Gender);
          setImage(response.data.Image);
          setCartID(response.data.ID_LibraryCard);
        }
      } catch (error) {
        console.log(error);
        navigate("/SignIn");
      }
    };
    getUser();
  }, [image]);
  return (
    <div
      style={{ background: colorBgContainer, padding: 20, borderRadius: 10 }}
    >
      {userName === "" || email === "" ? (
        <Spin size="large" />
      ) : (
        <div>
          <Form name="Update_Account" onFinish={onFinish}>
            <Descriptions>
              <Descriptions.Item>
                <Form.Item
                  label="Ảnh đại diện"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    customRequest={handleChange}
                    showUploadList={false}
                    disabled={componentDisabled}
                    listType="picture-circle"
                    type="cycle"
                  >
                    <Avatar
                      size={100}
                      src={
                        image && image.length > 13
                          ? `${image}`
                          : image
                          ? `http://localhost:5076/Users/Image/${image}`
                          : userName.substring(0, 1)
                      }
                    >
                      {image === null && userName.substring(0, 1)}
                    </Avatar>
                  </Upload>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item>
                <Form.Item
                  name="cartID"
                  label="Mã thẻ thư viện"
                  initialValue={cartID}
                >
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item>
                <Form.Item name="email" label="Email" initialValue={email}>
                  <Input disabled />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item>
                <Form.Item
                  name="username"
                  label="Tên người dùng"
                  initialValue={userName}
                >
                  <Input disabled={componentDisabled} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  initialValue={
                    birthday !== null ? moment(`${birthday}`, "YYYY-MM-DD") : ""
                  }
                >
                  <DatePicker
                    disabled={componentDisabled}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày sinh"
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  initialValue={gender}
                >
                  <Select
                    disabled={componentDisabled}
                    style={{
                      width: 120,
                    }}
                    allowClear
                    options={[
                      {
                        value: "Nam",
                        label: "Nam",
                      },
                      {
                        value: "Nữ",
                        label: "Nữ",
                      },
                    ]}
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item>
                <Form.Item
                  name="telePhone"
                  label="Số điện thoại"
                  initialValue={phoneNumber}
                >
                  <Input disabled={componentDisabled} />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item>
              <Button
                disabled={componentDisabled}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
          <div>
            {componentDisabled ? (
              <Button
                onClick={handleEnable}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Chỉnh sửa
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
}
