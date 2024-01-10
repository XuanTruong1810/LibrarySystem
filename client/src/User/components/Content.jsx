import React from "react";

export default function ContentLayout({ colorBgContainer }) {
  return (
    <div
      style={{
        padding: 24,
        minHeight: 550,
        background: colorBgContainer,
      }}
    >
      Bill is a cat.
    </div>
  );
}
