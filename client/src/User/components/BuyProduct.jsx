import { Button } from "antd";
import React from "react";

export default function BuyProduct({ onFinish, type }) {
  const handleBuyProduct = async (e) => {
    e.stopPropagation();
    onFinish();
  };
  return (
    <Button
      htmlType={type}
      onClick={handleBuyProduct}
      type="primary"
      block
      size="large"
      style={{
        width: 193,
      }}
    >
      Mua hàng
    </Button>
  );
}
