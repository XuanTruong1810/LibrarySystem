import { Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "./CardItem";

export const ProductSearch = ({ colorBgContainer }) => {
  const { key } = useParams();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const SearchProduct = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Product/SearchProduct",
          {
            params: {
              KeySearch: key,
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    SearchProduct();
  }, [key]);
  return (
    <div
      style={{
        padding: 24,
        minHeight: 550,
        background: colorBgContainer,
      }}
    >
      <Row
        gutter={[32, 16]}
        style={{
          marginBottom: 10,
        }}
      >
        {products.map((product) => {
          return <CardItem key={product.ID_Product} product={product} />;
        })}
      </Row>
    </div>
  );
};
