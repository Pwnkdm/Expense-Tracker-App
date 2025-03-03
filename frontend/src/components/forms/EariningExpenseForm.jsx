import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  TimePicker,
  Card,
  message,
  InputNumber,
  Spin,
} from "antd";
import { useAddExpenseMutation } from "../../features/apiSlice";
import dayjs from "dayjs";

const { Option } = Select;

const EariningExpenseForm = ({ form, isEditing = false }) => {
  const [addExpense] = useAddExpenseMutation();
  const [type, setType] = useState(form?.getFieldValue("type") || "expense");
  const [loading, setLoading] = useState(false);
  const [formInstance] = Form.useForm(); // Create a form instance if not provided

  const categories = {
    expense: [
      "Other Expense",
      "EMI Expense",
      "Bills",
      "Rent",
      "Food Expense",
      "Groceries",
      "Travel",
    ],
    earning: [
      "Salary",
      "Freelance",
      "Business Revenue",
      "Investments",
      "Other Revenue",
    ],
  };

  const handleSubmit = async (values) => {
    if (isEditing) return; // Skip submit handling when editing

    setLoading(true);
    try {
      // Format date and time properly
      const formattedValues = {
        ...values,
        date: values.date.format("YYYY-MM-DD"), // Use format() directly on dayjs object
        time: values.time.format("HH:mm"), // Convert 12-hour format to 24-hour for API
        amount: Number(values.amount), // Ensure amount is a number
      };

      const response = await addExpense(formattedValues).unwrap();

      if (response) {
        message.success(
          `${
            values.type === "expense" ? "Expense" : "Earning"
          } added successfully!`
        );
        // Use the provided form or fallback to local form instance
        (form || formInstance).resetFields();
        setType("expense");
      }
    } catch (error) {
      console.error("Error details:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to add expense/earning. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card
        title={isEditing ? "Edit Record" : "Add Expense / Earning"}
        bordered={false}
        className="max-w-lg w-full mx-4 my-6 shadow-md"
      >
        <Spin size="large" spinning={loading}>
          <Form
            form={form || formInstance}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: "expense",
              date: dayjs(),
              time: dayjs(),
            }}
          >
            {/* Date Picker */}
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select a date" }]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            {/* Time Picker */}
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: "Please select a time" }]}
              getValueProps={(value) => ({
                value: value ? dayjs(value, "hh:mm A") : null,
              })}
            >
              <TimePicker className="w-full" use12Hours format="hh:mm A" />
            </Form.Item>

            {/* Type Selector */}
            <Form.Item label="Type" name="type">
              <Select onChange={(value) => setType(value)}>
                <Option value="expense">Expense</Option>
                <Option value="earning">Earning</Option>
              </Select>
            </Form.Item>

            {/* Category Selector */}
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Category">
                {categories[type].map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Amount Input */}
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter an amount" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Amount"
                min={0}
                precision={0}
              />
            </Form.Item>

            {/* Description Input */}
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Description (optional)" />
            </Form.Item>

            {/* Submit Button - Only show when not editing */}
            {!isEditing && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Add {type === "expense" ? "Expense" : "Earning"}
                </Button>
              </Form.Item>
            )}
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default EariningExpenseForm;
