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

const EariningExpenseForm = () => {
  const [form] = Form.useForm();
  const [addExpense] = useAddExpenseMutation();
  const [type, setType] = useState("expense"); // Track selected type separately
  const [loading, setLoading] = useState(false); // Loading state

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
    setLoading(true); // Start loader
    try {
      const formattedValues = {
        ...values,
        date: dayjs(values.date).format("YYYY-MM-DD"), // Ensure date is in "YYYY-MM-DD" format
        time: dayjs(values.time).format("h:mm A"), // Format time as "12:30 PM"
      };

      await addExpense(formattedValues).unwrap(); // Wait for API response

      message.success(
        `${
          values.type === "expense" ? "Expense" : "Earning"
        } added successfully!`
      );

      form.resetFields();
      setType("expense"); // Reset category dropdown after submission
    } catch (error) {
      message.error("Error adding expense/earning.");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card
        title="Add Expense / Earning"
        bordered={false}
        className="max-w-lg w-full mx-4 my-6 shadow-md"
      >
        <Spin size="large" spinning={loading}>
          <Form
            form={form}
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
                value: value ? dayjs(value) : null, // Ensure value is handled correctly
              })}
            >
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                onChange={(date, dateString) => {
                  form.setFieldsValue({ date: dateString }); // Ensure local date format is used
                }}
              />
            </Form.Item>

            {/* Time Picker */}
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: "Please select a time" }]}
            >
              <TimePicker className="w-full" format="h:mm A" use12Hours />
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
                style={{ width: "100%" }} // Makes it full width like Input
                placeholder="Amount"
                min={0} // Ensures no negative values
                precision={0} // Ensures no decimals
              />
            </Form.Item>

            {/* Description Input */}
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Description (optional)" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Add {type === "expense" ? "Expense" : "Earning"}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default EariningExpenseForm;
