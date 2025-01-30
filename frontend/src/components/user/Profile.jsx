import React from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Avatar, Space } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils/commonFunc";

const { Title, Text } = Typography;

const Profile = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <Card
        className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-white"
        style={{ textAlign: "center" }}
      >
        <Space direction="vertical" size="large" className="w-full">
          {/* Profile Avatar with Initials */}
          <Avatar
            size={80}
            style={{
              backgroundColor: "#1890ff",
              color: "#fff",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {user?.username ? getInitials(user.username) : <UserOutlined />}
          </Avatar>

          {/* Profile Title */}
          <Title level={3} className="text-gray-800">
            {user?.username || "User Name"}
          </Title>

          {/* Profile Details */}
          <div className="flex flex-col items-center gap-2">
            <Space>
              <MailOutlined className="text-blue-500 text-lg" />
              <Text className="text-gray-600">
                {user?.email || "user@example.com"}
              </Text>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
