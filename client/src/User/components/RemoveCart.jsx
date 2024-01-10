import { Button } from "antd";
import axios from "axios";
import React from "react";

export default function RemoveCart({ ProductId }) {
  const handleRemoveCartItem = async () => {
    try {
      let response = await axios({
        method: "delete",
        url: "http://localhost:5076/api/Cart/DeleteCart",
        data: [ProductId],
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
    <Button onClick={handleRemoveCartItem} type="primary">
      Xóa
    </Button>
  );
}
