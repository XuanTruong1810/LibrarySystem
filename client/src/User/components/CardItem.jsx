import { Card, Col, InputNumber, Space } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCard from "./AddCard";
export default function CardItem({ product }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const handleClickItem = (key) => {
    navigate(`/ProductInfo/${key}`);
  };

  const onChange = (value) => {
    setCount(value);
  };

  return (
    <Col span={6}>
      <Card
        hoverable
        style={{
          width: 250,
        }}
        cover={
          <img
            onClick={(e) => {
              handleClickItem(product.ID_Product);
            }}
            alt="example"
            src={`http://localhost:5076/Products/Image/${product.Image}`}
          />
        }
      >
        <Meta title={product.Name_Product} />
        <Space
          direction="vertical"
          style={{
            margin: "10px 0 0 0",
          }}
        >
          <div>
            <span>Số lượng: </span>
            <span>
              <InputNumber
                min={1}
                max={5}
                defaultValue={1}
                onChange={onChange}
              />
            </span>
          </div>
          <AddCard id={product.ID_Product} count={count} />
        </Space>
      </Card>
    </Col>
  );
}
