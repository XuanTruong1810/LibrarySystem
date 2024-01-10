import { Button } from "antd";
import axios from "axios";
import React from "react";

export default function UpdateCart({ ProductId, quality }) {
  const handleUpdateCartItem = async () => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Cart/UpdateCart",
        params: {
          id: ProductId,
          Quality: quality,
        },
        withCredentials: true,
      });
      if (response.data) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={handleUpdateCartItem} type="primary">
      Sửa
    </Button>
  );
}
