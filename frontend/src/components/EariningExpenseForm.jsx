import { useState } from "react";
import { Form, Input, Select, Button, DatePicker, Card, message } from "antd";
import { useAddExpenseMutation } from "../features/apiSlice";
import dayjs from "dayjs";

const { Option } = Select;

const EariningExpenseForm = () => {
  const [form] = Form.useForm();
  const [addExpense] = useAddExpenseMutation();
  const [type, setType] = useState("expense"); // Track selected type separately

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
    try {
      await addExpense(values);
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
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card
        title="Add Expense / Earning"
        bordered={false}
        className="max-w-lg w-full mx-4 my-6 shadow-md"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: "expense",
            date: dayjs(),
          }}
        >
          {/* Date Picker */}
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
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
            <Input type="number" placeholder="Amount" />
          </Form.Item>

          {/* Description Input */}
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Description (optional)" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add {type === "expense" ? "Expense" : "Earning"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EariningExpenseForm;
