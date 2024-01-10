import { FacebookFilled } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

export default function LoginWithFacebook({ styleButton }) {
  return (
    <div>
      <Button
        size="large"
        icon={<FacebookFilled size="large" />}
        type="primary"
        className={styleButton}
      >
        Đăng nhập bằng Facebook
      </Button>
      ,
    </div>
  );
}
