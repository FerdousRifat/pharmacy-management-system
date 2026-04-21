import React, { useState } from "react";
import API from "../api";

function CustomerForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("customers/", form);
    setForm({ name: "", phone: "" });
    onSuccess();
    alert("Customer added successfully");
  };

  return (
    <div>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Customer Name" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default CustomerForm;