import React, { useEffect, useState } from "react";
import API from "../api";

function MedicineForm({ onSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    batch_no: "",
    expiry_date: "",
    quantity: "",
    price: "",
    supplier: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await API.get("suppliers/");
    setSuppliers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("medicines/", form);
    setForm({
      name: "",
      category: "",
      batch_no: "",
      expiry_date: "",
      quantity: "",
      price: "",
      supplier: ""
    });
    onSuccess();
    alert("Medicine added successfully");
  };

  return (
    <div>
      <h2>Add Medicine</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Medicine Name" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input name="batch_no" value={form.batch_no} onChange={handleChange} placeholder="Batch No" required />
        <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} required />
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" required />
        <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="Price" required />
        <select name="supplier" value={form.supplier} onChange={handleChange} required>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button type="submit">Add Medicine</button>
      </form>
    </div>
  );
}

export default MedicineForm;