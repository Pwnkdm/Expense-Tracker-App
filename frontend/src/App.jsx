import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Space,
  Avatar,
  theme,
  Drawer,
  Breadcrumb,
  message,
} from "antd";
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
import {
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./components/user/Profile";
import Footer from "./components/common/Footer";
import AuthPage from "./components/user/AuthPage";
import Analytics from "./components/reports/Analytics";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import MonthlyReportPage from "./components/reports/MonthlyReportPage";
import EariningExpenseForm from "./components/forms/EariningExpenseForm";

import { logOut } from "./features/auth/authSlice";
import { getInitials, isTokenExpired } from "./utils/commonFunc";
import { useLogoutMutation } from "./services/authApi";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

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
      setCollapsed(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const accessToken = localStorage.getItem("accessToken");
  const tokenValidation = isTokenExpired(accessToken);

  useEffect(() => {
    // Check token expiry on page load
    if (tokenValidation) {
      handleLogout();
    }
  }, [tokenValidation]);

  const handleLogout = async () => {
    setDrawerVisible(false);
    try {
      await logout().unwrap();
      dispatch(logOut());
      navigate("/login");
      message.success("User logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: (
        <div>
          <DashboardOutlined />
        </div>
      ),
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/analytics",
      icon: (
        <div>
          <FileTextOutlined />
        </div>
      ),
      label: <Link to="/analytics">Reports</Link>,
    },
    {
      key: "/earnexpense",
      icon: (
        <div>
          <DollarCircleOutlined />
        </div>
      ),
      label: <Link to="/earnexpense">Earnings & Expenses</Link>,
    },
    {
      key: "/profile",
      icon: (
        <div>
          <UserOutlined />
        </div>
      ),
      label: <Link to="/profile">Profile</Link>,
    },
  ];

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    return pathSegments.map((segment, index) => (
      <Breadcrumb.Item key={index}>
        {segment.charAt(0).toUpperCase() + segment.slice(1)}
      </Breadcrumb.Item>
    ));
  };

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="logo py-4 text-center">
        <img
          src="/rupee.png"
          className="mx-auto"
          height="30"
          width="30"
          alt="Logo"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="flex-1"
      />
      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
          },
        ]}
      />
    </div>
  );

  const MainLayout = ({ children }) => (
    <Layout hasSider>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {renderSidebarContent()}
        </Sider>
      )}
      <Layout style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
          }}
          className="flex justify-between items-center shadow-md"
        >
          {isMobile && (
            <>
              <Button
                type="text"
                icon={<MenuUnfoldOutlined style={{ fontSize: "25px" }} />}
                onClick={() => setDrawerVisible(true)}
                className="ml-4"
              />
              {/* <div className="text-lg font-bold">Pwn_kdm</div> */}
            </>
          )}
          <Space className={`${isMobile ? "ml-auto" : "ml-auto"} mr-4`}>
            <Link to="/profile">
              <Avatar
                size={40}
                style={{
                  backgroundColor: "#588157",
                  color: "#dad7cd",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {user?.username ? getInitials(user.username) : <UserOutlined />}
              </Avatar>
            </Link>
          </Space>
        </Header>
        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          <Breadcrumb style={{ marginBottom: "16px" }}>
            {getBreadcrumbItems()}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 200px)",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Your App ©{new Date().getFullYear()} Created by Your Name
        </Footer>
      </Layout>
    </Layout>
  );

  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/earnexpense"
                    element={<EariningExpenseForm />}
                  />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route
                    path="/monthly/:year/:month"
                    element={<MonthlyReportPage />}
                  />
                  <Route path="/profile" element={<Profile />} />
                  {/* Catch-all route for incorrect paths */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>

      {isMobile && (
        <Drawer
          title={
            <div className="w-full flex justify-center items-center text-white text-lg">
              Menu
            </div>
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          className="p-0"
          bodyStyle={{ padding: 0, backgroundColor: "#001529" }}
          headerStyle={{
            backgroundColor: "#001529",
            color: "white",
            border: "none",
          }}
          closeIcon={
            <MenuFoldOutlined
              style={{ color: "white", fontSize: "25px", marginRight: "30px" }}
            />
          }
          width={250}
        >
          {renderSidebarContent()}
        </Drawer>
      )}
    </>
  );
};

export default App;
