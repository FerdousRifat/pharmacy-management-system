import React, { useState } from "react";
import API from "../api";

function SupplierForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("suppliers/", form);
    setForm({ name: "", contact: "", address: "" });
    onSuccess();
    alert("Supplier added successfully");
  };

  return (
    <div>
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Supplier Name" required />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" required />
        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
        <button type="submit">Add Supplier</button>
      </form>
    </div>
  );
}

export default SupplierForm;