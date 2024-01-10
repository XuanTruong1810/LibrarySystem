import { Descriptions, Image, Space, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddCard from "./AddCard";

export default function ProductInfo() {
  const [data, setData] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const getItemById = async () => {
      let response = await axios.get(
        "http://localhost:5076/api/Product/GetProductByID",
        {
          params: {
            id,
          },
        }
      );
      console.log(response.data);
      if (response && response.data) {
        setData(response.data);
      }
    };
    getItemById();
  }, [id]);

  const items = [
    {
      key: "1",
      label: "Hình Ảnh",
      children: (
        <div style={{ textAlign: "center" }}>
          <Image
            width={150}
            height={150}
            src={`http://localhost:5076/Products/Image/${data.Image}`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Tên sản phẩm",
      children: `${data.Name_Product}`,
    },
    {
      key: "3",
      label: "Nhà xuất bản",
      children: `${data.Name_PublishingCompany}`,
    },
    {
      key: "4",
      label: "Tác giả",
      children: `${data.Name_Author}`,
    },
    {
      key: "5",
      label: "Mô tả sản phẩm",
      children: `${data.Description}`,
    },
  ];
  return (
    <div>
      {!data.Image ? (
        <Spin size="large" />
      ) : (
        <Descriptions title="Thông tin sản phẩm" bordered items={items} />
      )}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          height: "100%",
        }}
      >
        <Space>
          <AddCard id={id} count={1} />
        </Space>
      </div>
    </div>
  );
}
