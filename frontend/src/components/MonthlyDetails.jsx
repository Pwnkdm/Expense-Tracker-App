import React, { useRef } from "react";
import { Spin, Alert, Tag, Typography } from "antd";
import { CalendarOutlined, AppstoreOutlined } from "@ant-design/icons";
import RandomGradientTag from "./RandomGradientTag";

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

  return (
    <div
      ref={printRef}
      style={{
        padding: "10px",
        background: "white",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Title
        level={4}
        className="text-center"
        style={{ color: "#333", marginBottom: "20px" }}
      >
        {formattedMonth} Monthly Report
      </Title>

      {/* Report Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr 3fr",
          padding: "10px",
          fontWeight: "bold",
          borderBottom: "2px solid #ddd",
          backgroundColor: "#f4f4f4",
        }}
      >
        <div>
          <CalendarOutlined /> Date
        </div>
        <div>
          <AppstoreOutlined /> Category
        </div>
        <div>(₹) Amount</div>
        <div>Description</div>
      </div>

      {/* Report Data */}
      {data?.map((record) => {
        const isRevenue = record.type === "earning"; // Check if it's an earning
        return (
          <div
            key={record.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr 3fr",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>{new Date(record.date).toLocaleDateString()}</div>
            <div>
              {/* Gradient Tag */}
              <Tag
                color="default"
                style={{
                  background:
                    "linear-gradient(90deg, #000000 0%, #434343 100%)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {record.category}
              </Tag>
              {/* <RandomGradientTag record={record} /> */}
            </div>
            <div
              style={{
                color: isRevenue ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              ₹{record.amount.toLocaleString()}/-
            </div>
            <div>{record.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyDetails;
