import { Button } from "antd";
import axios from "axios";
import React from "react";
export default function AddCard({ id, count }) {
  const handleAddCart = async () => {
    try {
      let response = await axios({
        method: "post",
        url: "http://localhost:5076/api/Cart/AddCart",
        data: {
          ID_Product: id,
          Quality: count,
        },
        withCredentials: true,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={handleAddCart}
      type="primary"
      block
      size="large"
      style={{
        width: 193,
      }}
    >
      Thêm giỏ hàng
    </Button>
  );
}
