import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
const { Option } = Select;
const AddProduct = ({ checkChange, handleParentStateChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalAuthor, setShowAuthor] = useState(false);
  const [showModalPublisher, setShowPublisher] = useState(false);
  const [orderAuthor, setOtherAuthor] = useState("");
  const [orderPublisher, setOtherPublisher] = useState("");

  const [otherBrand, setOtherBrand] = useState("");
  const [image, setImage] = useState("");
  const handleOtherBrandChange = (e) => {
    setOtherBrand(e.target.value);
  };
  const handleOtherAuthorChange = (e) => {
    setOtherAuthor(e.target.value);
  };
  const handleOtherPublisherChange = (e) => {
    console.log(e.target.value);
    setOtherPublisher(e.target.value);
  };
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [publisher, setPublisher] = useState([]);
  const [check, setCheck] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onFinish = async (values) => {
    console.log(values, values.PublicationDate.format("YYYY-MM-DD"));
    try {
      let response = await axios({
        url: "http://localhost:5076/api/Manager/AddProduct",
        method: "post",
        data: {
          Name_Product: values.name,
          CountProduct: values.number,
          Description: values.description,
          PublicationDate: values.PublicationDate.format("YYYY-MM-DD"),
          ID_Brand: values.Brand,
          ID_PublishingCompany: values.publisher,
          ID_Author: values.Author,
          Image: image,
        },
        withCredentials: true,
      });

      if (response.data) {
        message.success("Thêm sản phẩm thành công");
        handleParentStateChange(!checkChange);
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };
  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5076/api/Product/GetBrand",
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  const fetchAuthorTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5076/api/Product/GetAuthor",
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setAuthors(response.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  const fetchPublisherTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5076/api/Product/GetPublisher",
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setPublisher(response.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleChange = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5076/api/Upload/UploadImageProduct",
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setImage(response.data);

        message.success(`Uploaded successfully`);
        onSuccess();
      } else {
        message.error(`Upload failed.`);
        onError();
      }
    } catch (error) {
      console.error("Error during upload:", error);
      onError();
    }
  };
  useEffect(() => {
    fetchProductTypes();
    fetchPublisherTypes();
    fetchAuthorTypes();
  }, [check]);
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm sản phẩm
      </Button>
      <Drawer
        title="Tạo mới sản phẩm"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Thoát</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Chấp nhận
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="Image"
            label="Ảnh sản phẩm"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={handleChange}
              showUploadList={false}
              listType="picture-card"
            >
              <Avatar
                shape="square"
                size={100}
                src={
                  image ? `http://localhost:5076/Products/Image/${image}` : null
                }
              ></Avatar>
            </Upload>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên sản phẩm",
                  },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Author"
                label="Tác giả"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn tác giả",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn tác giả"
                  onChange={(value) => {
                    if (value === "otherAuthor") {
                      console.log("otherAuthor");
                      setShowAuthor(true);
                    } else {
                      setShowAuthor(false);
                    }
                  }}
                >
                  {authors.map((author) => {
                    return (
                      <Option key={author.ID_Author} value={author.ID_Author}>
                        {author.Name_Author}
                      </Option>
                    );
                  })}
                  <Option value="otherAuthor">Khác</Option>
                </Select>
              </Form.Item>
              <Modal
                title="Nhập tên tác giả"
                open={showModalAuthor}
                onCancel={() => setShowAuthor(false)}
                onOk={async () => {
                  try {
                    axios({
                      method: "post",
                      url: "http://localhost:5076/api/Manager/AddAuthor",
                      params: {
                        name: orderAuthor,
                      },
                      withCredentials: true,
                    });
                    setShowAuthor(false);
                    setCheck(!check);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Form.Item
                  name="otherBrand"
                  label="Tên tác giả"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên tác giả",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên tác giả"
                    value={orderAuthor}
                    onChange={handleOtherAuthorChange}
                  />
                </Form.Item>
              </Modal>
            </Col>
            <Col span={12}>
              <Form.Item name="PublicationDate" label="Ngày xuất bản">
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publisher"
                label="Nhà xuất bản"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn nhà xuất bản",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn nhà xuất bản"
                  onChange={(value) => {
                    if (value === "otherPublisher") {
                      setShowPublisher(true);
                    } else {
                      setShowPublisher(false);
                    }
                  }}
                >
                  {publisher.map((publisher) => {
                    return (
                      <Option
                        key={publisher.ID_PublishingCompany}
                        value={publisher.ID_PublishingCompany}
                      >
                        {publisher.Name_PublishingCompany}
                      </Option>
                    );
                  })}
                  <Option value="otherPublisher">Khác</Option>
                </Select>
              </Form.Item>
              <Modal
                title="Nhập tên nhà xuất bản"
                open={showModalPublisher}
                onCancel={() => setShowPublisher(false)}
                onOk={async () => {
                  try {
                    axios({
                      method: "post",
                      url: "http://localhost:5076/api/Manager/AddPublisher",
                      params: {
                        name: orderPublisher,
                      },
                      withCredentials: true,
                    });
                    setShowPublisher(false);
                    setCheck(!check);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Form.Item
                  name="otherPublisher"
                  label="Tên nhà xuất bản"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên nhà xuất bản",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên nhà xuất bản"
                    value={orderPublisher}
                    onChange={handleOtherPublisherChange}
                  />
                </Form.Item>
              </Modal>
            </Col>
            <Col span={12}>
              <Form.Item
                name="number"
                label="số lượng"
                initialValue={1}
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số lượng",
                  },
                ]}
              >
                <InputNumber minLength={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Brand"
                label="Loại sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn loại sản phẩm",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn loại sản phẩm"
                  onChange={(value) => {
                    if (value === "other") {
                      setShowModal(true);
                    } else {
                      setShowModal(false);
                    }
                  }}
                >
                  {brands.map((brand) => {
                    return (
                      <Option key={brand.ID_Brand} value={brand.ID_Brand}>
                        {brand.Name_Brand}
                      </Option>
                    );
                  })}
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
              <Modal
                title="Nhập tên loại sản phẩm khác"
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={async () => {
                  try {
                    axios({
                      method: "post",
                      url: "http://localhost:5076/api/Manager/AddBrand",
                      params: {
                        name: otherBrand,
                      },
                      withCredentials: true,
                    });
                    setShowModal(false);
                    setCheck(!check);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Form.Item
                  name="otherBrand"
                  label="Tên loại sản phẩm khác"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên loại sản phẩm khác",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên loại sản phẩm khác"
                    value={otherBrand}
                    onChange={handleOtherBrandChange}
                  />
                </Form.Item>
              </Modal>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mô tả sản phẩm",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Mô tả sản phẩm" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default AddProduct;
