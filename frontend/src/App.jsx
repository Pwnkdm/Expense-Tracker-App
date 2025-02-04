import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Space, Avatar, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "./features/auth/authSlice";
import { useLogoutMutation } from "./services/authApi";
import Navbar from "./components/Navbar";
import EariningExpenseForm from "./components/EariningExpenseForm";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import MonthlyReportPage from "./components/MonthlyReportPage";
import AuthPage from "./components/user/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/user/Profile";
import { getInitials } from "./utils/commonFunc";
import Dashboard from "./components/dashboard/Dashboard";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);
  const user = useSelector((state) => state.auth.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isSmallScreen);
      setCollapsed(isSmallScreen);
      setIsSidebarVisible(!isSmallScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout className="h-screen flex">
      <Routes>
        {/* Public Routes - No Sidebar */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* Private Routes - With Sidebar */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout className="flex flex-1 h-screen">
                {/* Sidebar inside PrivateRoute */}
                {isSidebarVisible && (
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
                      <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[window.location.pathname]}
                        selectedKeys={[window.location.pathname]} // Highlights the active route
                      >
                        <Menu.Item
                          key="/dashboard"
                          icon={<DashboardOutlined />}
                        >
                          <Link to="/dashboard">Dashboard</Link>
                        </Menu.Item>

                        <Menu.Item key="/analytics" icon={<FileTextOutlined />}>
                          <Link to="/analytics">Reports</Link>
                        </Menu.Item>

                        <Menu.Item
                          key="/earnexpense"
                          icon={<DollarCircleOutlined />}
                        >
                          <Link to="/earnexpense">Earnings & Expenses</Link>
                        </Menu.Item>

                        <Menu.Item key="/profile" icon={<UserOutlined />}>
                          <Link to="/profile">Profile</Link>
                        </Menu.Item>
                      </Menu>
                    </div>

                    {/* Logout Button Pinned to Bottom */}
                    <div className="mt-auto mb-4">
                      <Menu theme="dark" mode="inline">
                        <Menu.Item
                          key="logout"
                          icon={<LogoutOutlined />}
                          onClick={handleLogout}
                        >
                          Logout
                        </Menu.Item>
                      </Menu>
                    </div>
                  </Sider>
                )}

                <Layout className="flex flex-col flex-1 h-screen">
                  {/* Header */}
                  <Header className="p-0 bg-white shadow-md flex items-center justify-between">
                    {/* Mobile Toggle Button */}
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
                      onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                      className="ml-4 text-white lg:hidden"
                    />

                    {/* Profile Avatar */}
                    <Space>
                      <Link to="/profile">
                        <Avatar
                          size={40}
                          style={{
                            backgroundColor: "#ffff",
                            color: "#ffaa00",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          {user?.username ? (
                            getInitials(user.username)
                          ) : (
                            <UserOutlined />
                          )}
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
                      <Route
                        path="/earnexpense"
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
                        path="/monthly/:year/:month"
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

                      <Route
                        path="/dashboard"
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Content>

                  {/* Footer */}
                  <Footer className="bg-white shadow-md text-center p-4" />
                </Layout>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
