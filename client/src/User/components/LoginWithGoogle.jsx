import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginWithGoogle({ styleButton }) {
  const navigate = useNavigate();
  const handleDataGoogle = async (dataGoogle) => {
    if (dataGoogle && dataGoogle.credential) {
      try {
        const res = await axios(
          "http://localhost:5076/api/Account/GoogleLogin",
          {
            method: "POST",
            withCredentials: true,
            params: {
              token: dataGoogle.credential,
            },
          }
        );

        if (res.data) {
          navigate(res.data.roles[0] === "User" ? "/" : "/Admin");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div>
      <GoogleOAuthProvider clientId="857257772717-jjl1502m9mblrfoqku9q8k7t0r638lru.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleDataGoogle}
          onError={() => {
            console.log("error");
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
}
