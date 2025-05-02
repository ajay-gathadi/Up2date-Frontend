import React from "react";

function CustomerName({ value, onChange }) {
  const handleNameChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="customerName">
      <label
        id="name"
        htmlFor="inputCustomerName"
        style={{ fontFamily: "Inter" }}
      >
        Customer Name
      </label>
      <input
        id="inputCustomerName"
        type="text"
        placeholder="Enter Customer Name"
        onChange={handleNameChange}
        value={value}
        style={{ fontFamily: "Inter" }}
      />
    </div>
  );
}

export default CustomerName;
