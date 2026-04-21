import React, { useEffect, useState } from "react";
import API from "../api";

function SaleForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchData();
  }, [onSuccess]);

  const fetchData = async () => {
    const c = await API.get("customers/");
    const m = await API.get("medicines/");
    setCustomers(c.data);
    setMedicines(m.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customer_id: customerId,
      items: [
        {
          medicine_id: medicineId,
          quantity: quantity
        }
      ]
    };

    const res = await API.post("create-sale/", payload);
    setLastSale(res.data);
    setCustomerId("");
    setMedicineId("");
    setQuantity("");
    onSuccess();
    alert("Sale created successfully");
  };

  return (
    <div>
      <h2>Create Sale / Billing</h2>
      <form onSubmit={handleSubmit}>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={medicineId} onChange={(e) => setMedicineId(e.target.value)} required>
          <option value="">Select Medicine</option>
          {medicines.map((m) => (
            <option key={m.id} value={m.id}>{m.name} (Stock: {m.quantity})</option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          required
        />

        <button type="submit">Create Sale</button>
      </form>

      {lastSale && (
        <div style={{ marginTop: "15px" }}>
          <h3>Last Invoice</h3>
          <p>Sale ID: {lastSale.id}</p>
          <p>Customer: {lastSale.customer_name}</p>
          <p>Total: {lastSale.total_amount}</p>
          <a
            href={`http://127.0.0.1:8000/api/export-invoice/${lastSale.id}/`}
            target="_blank"
            rel="noreferrer"
          >
            Download Invoice XML
          </a>
        </div>
      )}
    </div>
  );
}

export default SaleForm;