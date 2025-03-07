import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Card,
  message, // Import message from antd
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
} from "../../services/authApi"; // Import RTK queries

const { Title } = Typography;

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [rememberMe, setRememberMe] = useState(false);
  const [form] = Form.useForm();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  // RTK mutations for login and signup
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation(); // Added forgot password mutation

  // Load saved email and password if "Remember Me" was previously checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedEmail && savedPassword) {
      form.setFieldsValue({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, [form]);

  useEffect(() => {
    if (location.pathname === "/login") {
      setIsLogin(true);
    } else if (location.pathname === "/signup") {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const handleSubmit = async (values) => {
    const { email, password, username, remember } = values;

    if (remember) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.setItem("rememberMe", "false");
    }

    if (isLogin) {
      try {
        await login({ email, password }).unwrap();
        navigate("/dashboard");
      } catch (err) {
        console.error("Login failed:", err);
      }
    } else {
      try {
        await signup({ email, password, username }).unwrap();
        navigate("/login");
      } catch (err) {
        console.error("Signup failed:", err);
        message.error(
          err?.data?.errors?.[0]?.msg
            ? err?.data?.errors?.[0]?.msg
            : err?.data?.msg
            ? err?.data?.msg
            : "Something went wrong!"
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getFieldValue("email");
    if (email) {
      try {
        await forgotPassword(email).unwrap();
        message.success("Check your email for reset instructions!"); // Use message from antd
        startTimer();
      } catch (err) {
        console.error("Forgot password failed:", err);
      }
    } else {
      message.error("Please enter your email to reset password."); // Use message from antd
    }
  };

  const startTimer = () => {
    setShowResetPassword(false);
    setTimer(60); // Set timer for 60 seconds
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card className="w-full max-w-sm shadow-lg p-6">
        <Title level={3} className="text-center">
          {isLogin ? "Login" : "Sign Up"}
        </Title>

        {showResetPassword ? (
          <Form
            form={form}
            name="reset-password-form"
            onFinish={handleForgotPassword}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isForgotPasswordLoading}
              >
                Send Reset Email
              </Button>
            </Form.Item>
            {timer > 0 && <div>Resend email in {timer} seconds</div>}
          </Form>
        ) : (
          <Form form={form} name="auth-form" onFinish={handleSubmit}>
            {/* Email */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            {/* Username for Sign Up only */}
            {!isLogin && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
            )}

            {/* Password */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            {/* Remember Me */}
            {isLogin && (
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
              </Form.Item>
            )}

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isLogin ? isLoginLoading : isSignupLoading}
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </Form.Item>

            {/* Forgot Password Button */}
            {isLogin && (
              <Row>
                <Col span={24} className="text-center">
                  <Button
                    type="link"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </Col>
              </Row>
            )}

            {/* Toggle between Login and Sign Up */}
            <Row>
              <Col span={24} className="text-center">
                <Button
                  type="link"
                  onClick={() =>
                    isLogin
                      ? (window.location.href = "/signup")
                      : (window.location.href = "/login")
                  }
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Log In"}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
