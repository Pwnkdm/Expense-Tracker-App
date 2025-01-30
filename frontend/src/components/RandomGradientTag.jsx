import React from "react";
import { Tag } from "antd";

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate a random gradient
const getRandomGradient = () => {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  return `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`;
};

const RandomGradientTag = ({ record }) => {
  return (
    <Tag
      color="default"
      style={{
        background: getRandomGradient(),
        color: "white",
        fontWeight: "bold",
      }}
    >
      {record.category}
    </Tag>
  );
};

export default RandomGradientTag;
