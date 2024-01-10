import axios from "axios";
import { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { Pagination, Row } from "antd";
import { useParams } from "react-router-dom";

export const ListProDuct = ({ colorBgContainer }) => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProduct = async () => {
      let response = await axios.get(
        "http://localhost:5076/api/Product/GetProductPage",
        {
          params: {
            pageNumber: currentPage,
            pageSize: "8",
          },
        }
      );
      setTotalProduct(response.data.TotalProductCount);
      setProducts(response.data.Products);
    };
    getProduct();
  }, [currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const sortedProducts = [...products];
    if (id === "1") {
      sortedProducts.sort((a, b) => a.Prince - b.Prince);
    } else if (id === "2") {
      sortedProducts.sort((a, b) => b.Prince - a.Prince);
    }
    setProducts(sortedProducts);
  }, [id]);

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
      <Pagination
        style={{
          padding: "10px 0 0 0",
          textAlign: "center",
        }}
        simple
        defaultCurrent={1}
        currentPage={currentPage}
        onChange={handlePageChange}
        total={totalProduct}
      />
    </div>
  );
};
