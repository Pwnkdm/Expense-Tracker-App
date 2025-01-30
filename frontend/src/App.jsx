import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, theme, Space, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BarChartOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { logOut } from "./features/auth/authSlice"; // Import logOut action
import { useLogoutMutation } from "./services/authApi"; // Import useLogoutMutation hook
import Navbar from "./components/Navbar";
import EariningExpenseForm from "./components/EariningExpenseForm";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import MonthlyReportPage from "./components/MonthlyReportPage";
import AuthPage from "./components/user/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/user/Profile";
import { getInitials } from "./utils/commonFunc";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = useSelector((state) => state.auth.user); // Get user from Redux

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Use navigate to redirect after logout
  const [logout] = useLogoutMutation(); // Use the useLogoutMutation hook

  // Update state based on screen resize
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isSmallScreen);
      setCollapsed(isSmallScreen); // Auto-collapse on small screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout handler that calls the API and clears the user session
  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Call the logout API
      dispatch(logOut()); // Clear the Redux authentication state
      navigate("/login"); // Redirect to the login page after logging out
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout className="h-screen flex">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="h-screen flex flex-col fixed md:relative"
      >
        {/* Logo / Navbar */}
        <div className="text-white text-center py-4 text-lg font-bold">
          {collapsed ? (
            <img
              src="/rupee.png"
              className="flex align-middle items-center m-auto"
              height={"30px"}
              width={"30px"}
            />
          ) : (
            <Navbar />
          )}
        </div>

        {/* Sidebar Menu */}
        <div className="flex flex-col flex-grow">
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<DollarOutlined />}>
              <Link to="/">Earnings & Expenses</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BarChartOutlined />}>
              <Link to="/analytics">Analytics</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
          </Menu>
        </div>

        {/* Logout Button Pinned to Bottom */}
        <div className="mt-auto mb-4">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>

      <Layout className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <Header className="p-0 bg-white shadow-md flex items-center justify-between">
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined
                  className="text-white"
                  style={{ color: "white", fontSize: "30px" }}
                />
              ) : (
                <MenuFoldOutlined
                  className="text-white"
                  style={{ color: "white", fontSize: "30px" }}
                />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            disabled={isMobile} // Disable toggle on mobile
            className="ml-4 text-white"
          />

          {/* Profile Avatar */}
          <Space>
            <Link to="/profile">
              <Avatar
                size={40}
                style={{
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {user?.username ? getInitials(user.username) : <UserOutlined />}
              </Avatar>
            </Link>
          </Space>
        </Header>

        {/* Content */}
        <Content
          className="flex-1 overflow-auto p-6 bg-gray-100"
          style={{ borderRadius: borderRadiusLG }}
        >
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <EariningExpenseForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />
            <Route
              path="/month/:month"
              element={
                <PrivateRoute>
                  <MonthlyReportPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Content>

        {/* Footer */}
        <Footer className="bg-white shadow-md text-center p-4" />
      </Layout>
    </Layout>
  );
};

export default App;
