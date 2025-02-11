import React, { useRef } from "react";
import { Spin, Alert, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
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

  return (
    <div ref={printRef} className="p-3 bg-white w-full box-border">
      <Title level={4} className="text-center text-gray-800 mb-5">
        {formattedMonth} Monthly Report
      </Title>

      {/* Report Headers */}
      <div className="hidden md:grid md:grid-cols-5 gap-4 p-3 font-bold border-b-2 border-gray-300 bg-gray-100">
        <div>
          <CalendarOutlined /> Date
        </div>
        <div>
          <ClockCircleOutlined /> Time
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
            className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border-b border-gray-800"
          >
            {/* Date */}
            <div className="md:hidden font-bold">Date:</div>
            <div>
              {new Date(record.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>

            {/* Time */}
            <div className="md:hidden font-bold">Time:</div>
            <div>{record?.time ? record.time : "-"}</div>

            {/* Category */}
            <div className="md:hidden font-bold">Category:</div>
            <div>
              <Tag
                color="default"
                className="bg-gradient-to-r from-black to-gray-700 text-white font-bold"
              >
                {record.category}
              </Tag>
            </div>

            {/* Amount */}
            <div className="md:hidden font-bold">Amount:</div>
            <div
              className={`font-bold ${
                isRevenue ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{record.amount.toLocaleString()}/-
            </div>

            {/* Description */}
            <div className="md:hidden font-bold">Description:</div>
            <div>{record.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyDetails;
