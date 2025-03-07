import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      const data = await response.json();
      if (data.message === "Password reset successful") {
        message.success("Password reset successful!");
        navigate("/login");
      } else {
        message.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Reset Password
        </h2>

        {!token ? (
          <p className="text-red-500 text-center">Invalid or missing token</p>
        ) : (
          <>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              className="mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              className="mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
