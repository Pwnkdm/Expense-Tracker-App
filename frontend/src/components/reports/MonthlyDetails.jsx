import React, { useRef, useState } from "react";
import {
  Spin,
  Alert,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tooltip,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  EditFilled,
  DeleteFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import {
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetMonthlyDetailsQuery,
} from "../../features/apiSlice";
import dayjs from "dayjs";
import EariningExpenseForm from "../forms/EariningExpenseForm";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const MonthlyDetails = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();
  const printRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    type: undefined,
    category: undefined,
    description: undefined,
    sortOrder: "asc",
  });

  const { data, isLoading, error } = useGetMonthlyDetailsQuery({
    year,
    month,
    ...filters,
  });

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

  const handleFilterChange = (value, filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value || undefined,
    }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const resetAllFilters = () => {
    setFilters({
      type: undefined,
      category: undefined,
      description: undefined,
      sortOrder: "asc",
    });
  };

  const renderFilters = () => (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-row gap-2">
          <Select
            placeholder="Type"
            allowClear
            className="min-w-[120px] sm:w-[150px]"
            onChange={(value) => handleFilterChange(value, "type")}
            value={filters.type}
            size="middle"
          >
            <Option value="earning">Earning</Option>
            <Option value="expense">Expense</Option>
          </Select>
          <Select
            placeholder="Category"
            allowClear
            className="min-w-[150px] sm:w-[180px]"
            onChange={(value) => handleFilterChange(value, "category")}
            value={filters.category}
            size="middle"
          >
            <Option value="salary">Salary</Option>
            <Option value="food">Food</Option>
            <Option value="transport">Transport</Option>
            <Option value="utilities">Utilities</Option>
            <Option value="entertainment">Entertainment</Option>
            <Option value="other">Other</Option>
          </Select>
        </div>
        <div className="flex flex-1 gap-2">
          <Search
            placeholder="Search description"
            allowClear
            className="flex-1 max-w-[200px]"
            onSearch={(value) => handleFilterChange(value, "description")}
            value={filters.description}
            size="middle"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div ref={printRef} className="p-3 bg-white w-full box-border">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex flex-row items-center gap-4 mb-4">
          <Tooltip title="Back">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              size="middle"
            />
          </Tooltip>

          <div className="ml-auto flex items-center gap-4">
            {renderFilters()}
            <Tooltip
              title={
                filters.sortOrder === "asc"
                  ? "Sort Descending"
                  : "Sort Ascending"
              }
            >
              <Button
                icon={
                  filters.sortOrder === "asc" ? (
                    <SortAscendingOutlined />
                  ) : (
                    <SortDescendingOutlined />
                  )
                }
                onClick={toggleSortOrder}
                type="default"
                size="middle"
              />
            </Tooltip>
            <Tooltip title="Reset filters">
              <Button
                icon={<ClearOutlined />}
                onClick={resetAllFilters}
                type="default"
                size="middle"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={
            error?.data?.message || "Failed to fetch monthly details"
          }
          type="error"
          showIcon
          className="m-4"
        />
      ) : !data || data.length === 0 ? (
        <Empty description="No records found for this month" className="my-8" />
      ) : (
        <>
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
                className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border-b border-gray-200 hover:bg-gray-50"
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
                    color={isRevenue ? "success" : "error"}
                    className="font-semibold"
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="md:hidden font-bold mb-1">Actions:</span>
                  <Tooltip title="Edit Record" placement="left">
                    <Button
                      type="primary"
                      icon={<EditFilled />}
                      onClick={() => handleEdit(record)}
                      className="flex-1 sm:flex-none"
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Delete Record"
                    description="Are you sure you want to delete this record?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Delete Record" placement="right">
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteFilled />}
                        loading={isDeleting && deletingId === record._id}
                        className="flex-1 sm:flex-none"
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </>
      )}

      <Modal
        open={!!editingId}
        onOk={handleUpdate}
        onCancel={() => {
          setEditingId(null);
          form.resetFields();
        }}
        confirmLoading={isUpdating}
        width="95%"
        style={{ maxWidth: "600px" }}
      >
        <Spin spinning={isUpdating}>
          <EariningExpenseForm form={form} isEditing={true} />
        </Spin>
      </Modal>
    </div>
  );
};

export default MonthlyDetails;
