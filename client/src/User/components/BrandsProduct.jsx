import { Empty, Row } from "antd";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "./CardItem";

export const BrandsProduct = ({ colorBgContainer }) => {
  const [Products, SetProduct] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const GetIDByBrand = async () => {
      try {
        let data = await axios.get(
          "http://localhost:5076/api/Product/GetProductByIDBrand",
          {
            params: {
              id,
            },
          }
        );
        SetProduct(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetIDByBrand();
  }, [id]);
  return (
    <div
      style={{
        padding: 24,
        minHeight: 550,
        background: colorBgContainer,
      }}
    >
      {Products.length > 0 ? (
        <Row
          gutter={[32, 16]}
          style={{
            marginBottom: 10,
          }}
        >
          {Products.map((product) => {
            return <CardItem key={product.ID_Product} product={product} />;
          })}
        </Row>
      ) : (
        <Empty description={false} />
      )}
    </div>
  );
};
