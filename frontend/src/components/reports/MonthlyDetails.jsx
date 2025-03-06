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
  Table,
  Typography,
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
  PrinterOutlined,
} from "@ant-design/icons";
import {
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetMonthlyDetailsQuery,
} from "../../features/apiSlice";
import dayjs from "dayjs";
import EariningExpenseForm from "../forms/EariningExpenseForm";
import { useNavigate, useParams } from "react-router-dom";
import { categories, handlePrint } from "../../utils/commonFunc";

const allCategories = Object.values(categories).flat();

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

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
        <div className="flex flex-row gap-2 flex-wrap">
          <Select
            placeholder="Type"
            allowClear
            className="min-w-[120px] w-full sm:w-[150px]"
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
            className="min-w-[150px] w-full sm:w-[180px]"
            onChange={(value) => handleFilterChange(value, "category")}
            value={filters.category}
            size="middle"
          >
            {allCategories &&
              allCategories?.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
          </Select>
        </div>
        <div className="flex flex-1 gap-2">
          <Search
            placeholder="Search description"
            allowClear
            className="max-w-[300px] sm:w-auto"
            onSearch={(value) => handleFilterChange(value, "description")}
            value={filters.description}
            size="middle"
          />
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      title: (
        <>
          <CalendarOutlined /> Date
        </>
      ),
      dataIndex: "date",
      key: "date",
      width: "120px",
      render: (date) =>
        new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: (
        <>
          <ClockCircleOutlined /> Time
        </>
      ),
      dataIndex: "time",
      key: "time",
      width: "100px",
      responsive: ["sm"],
      render: (time) => time || "-",
    },
    {
      title: (
        <>
          <AppstoreOutlined /> Category
        </>
      ),
      dataIndex: "category",
      key: "category",
      width: "150px",
      render: (category, record) => (
        <Tag
          color={record.type === "earning" ? "success" : "error"}
          className="font-semibold whitespace-nowrap"
        >
          {category}
        </Tag>
      ),
    },
    {
      title: "(₹) Amount",
      dataIndex: "amount",
      key: "amount",
      width: "120px",
      render: (amount, record) => (
        <span
          className={`font-bold whitespace-nowrap ${
            record.type === "earning" ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{amount.toLocaleString()}/-
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["sm"],
      render: (text) => <div className="break-words max-w-[300px]">{text}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div className="flex flex-row gap-2 flex-nowrap">
          <Tooltip title="Edit Record">
            <Button
              type="primary"
              icon={<EditFilled />}
              onClick={() => handleEdit(record)}
              size="middle"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Record"
            description="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Record">
              <Button
                type="primary"
                danger
                icon={<DeleteFilled />}
                loading={isDeleting && deletingId === record._id}
                size="middle"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div ref={printRef} className="p-2 sm:p-3 bg-white w-full box-border">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <Tooltip title="Back">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              size="middle"
            />
          </Tooltip>

          <Title level={4} className="m-0 mb-0">
            {new Date(`${year}-${month}-01`).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </Title>

          <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {renderFilters()}
            <div className="flex flex-row gap-2 justify-end">
              <Tooltip title="Print">
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint({ columns, data, month, year })}
                  type="default"
                  size="middle"
                />
              </Tooltip>
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
      </div>

      {error ? (
        <Alert
          message="Error"
          description={
            error?.data?.message || "Failed to fetch monthly details"
          }
          type="error"
          showIcon
          className="m-4"
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            rowKey="_id"
            scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
            size="middle"
            pagination={{
              responsive: true,
              position: ["bottomCenter"],
              showSizeChanger: true,
              pageSize: 30,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              style: {
                position: "sticky",
                bottom: 0,
                zIndex: 2,
                backgroundColor: "#fff",
              },
            }}
            locale={{
              emptyText: (
                <Empty description="No records found for this month" />
              ),
            }}
            sticky={{ offsetScroll: 0 }}
          />
        </div>
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
