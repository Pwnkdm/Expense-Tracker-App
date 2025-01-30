import React, { useRef } from "react";
import { Table, Card, Typography, Spin, Alert, Tag } from "antd";
import {
  CalendarOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const MonthlyDetails = ({ month, data, isLoading, error }) => {
  const formattedMonth = month?.charAt(0).toUpperCase() + month?.slice(1);
  const printRef = useRef(); // Ref for printing

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert message="Error fetching monthly details" type="error" showIcon />
    );
  }

  const columns = [
    {
      title: (
        <span className="font-semibold">
          <CalendarOutlined /> Date
        </span>
      ),
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: (
        <span className="font-semibold">
          <AppstoreOutlined /> Category
        </span>
      ),
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: <span className="font-semibold">(₹) Amount</span>,
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        const isRevenue = record.type === "earning"; // Check if it's an earning
        return (
          <span
            style={{ color: isRevenue ? "green" : "red", fontWeight: "bold" }}
          >
            ₹{record.amount.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
  ];

  return (
    <div ref={printRef} style={{ padding: "10px", background: "white" }}>
      <Title level={4} className="text-center" style={{ color: "#333" }}>
        {formattedMonth} Monthly Report
      </Title>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false} // Removed pagination
        scroll={{ y: 400 }} // Makes table scrollable vertically
        rowClassName={(record) =>
          record.type === "earning" ? "bg-green-100" : "bg-red-100"
        }
      />
    </div>
  );
};

export default MonthlyDetails;
