import React, { useRef, useState } from "react";
import {
  Spin,
  Alert,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  Select,
  Popconfirm,
} from "antd";
import {
  CalendarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../../features/apiSlice";
import dayjs from "dayjs";
import EariningExpenseForm from "../forms/EariningExpenseForm";

const { Title } = Typography;
const { Option } = Select;

const MonthlyDetails = ({ month, data, isLoading, error }) => {
  const formattedMonth = month?.charAt(0).toUpperCase() + month?.slice(1);
  const printRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form] = Form.useForm();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      time: record.time ? dayjs(record.time, "HH:mm") : null,
    });
    setEditingId(record._id);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateExpense({
        id: editingId,
        ...values,
        time: values.time ? values.time.format("HH:mm") : null,
      }).unwrap();
      setEditingId(null);
      form.resetFields();
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteExpense(id).unwrap();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error?.data?.message || "Failed to fetch monthly details"}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert
        message="No Data"
        description="No records found for this month"
        type="info"
        showIcon
        className="m-4"
      />
    );
  }

  return (
    <div ref={printRef} className="p-3 bg-white w-full box-border">
      <Title level={4} className="text-center text-gray-800 mb-5">
        {formattedMonth} Monthly Report
      </Title>

      {/* Report Headers */}
      <div className="hidden md:grid md:grid-cols-6 gap-4 p-3 font-bold border-b-2 border-gray-300 bg-gray-100">
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
        <div>Actions</div>
      </div>

      {/* Report Data */}
      {data?.map((record) => {
        const isRevenue = record.type === "earning";
        return (
          <div
            key={record._id}
            className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border-b border-gray-800 hover:bg-gray-50"
          >
            <div className="flex flex-col md:block">
              <span className="md:hidden font-bold mb-1">Date:</span>
              {new Date(record.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>

            <div className="flex flex-col md:block">
              <span className="md:hidden font-bold mb-1">Time:</span>
              {record?.time ? record.time : "-"}
            </div>

            <div className="flex flex-col md:block">
              <span className="md:hidden font-bold mb-1">Category:</span>
              <Tag
                color="default"
                className="bg-gradient-to-r from-black to-gray-700 text-white font-bold"
              >
                {record.category}
              </Tag>
            </div>

            <div className="flex flex-col md:block">
              <span className="md:hidden font-bold mb-1">Amount:</span>
              <span
                className={`font-bold ${
                  isRevenue ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{record.amount.toLocaleString()}/-
              </span>
            </div>

            <div className="flex flex-col md:block">
              <span className="md:hidden font-bold mb-1">Description:</span>
              {record.description}
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <span className="md:hidden font-bold mb-1">Actions:</span>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                className="w-full md:w-auto"
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete Record"
                description="Are you sure you want to delete this record?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  loading={isDeleting && deletingId === record._id}
                  className="w-full md:w-auto"
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        );
      })}

      <Modal
        title="Edit Record"
        open={!!editingId}
        onOk={handleUpdate}
        onCancel={() => {
          setEditingId(null);
          form.resetFields();
        }}
        confirmLoading={isUpdating}
      >
        <Spin spinning={isUpdating}>
          <EariningExpenseForm form={form} isEditing={true} />
        </Spin>
      </Modal>
    </div>
  );
};

export default MonthlyDetails;
