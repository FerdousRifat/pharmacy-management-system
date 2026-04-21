import React, { useEffect, useState } from "react";
import API from "../api";

function MedicineList({ refresh }) {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, [refresh]);

  const fetchMedicines = async () => {
    const res = await API.get("medicines/");
    setMedicines(res.data);
  };

  const deleteMedicine = async (id) => {
    await API.delete(`medicines/${id}/`);
    fetchMedicines();
  };

  return (
    <div>
      <h2>Medicine List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td>{med.category}</td>
              <td>{med.batch_no}</td>
              <td>{med.expiry_date}</td>
              <td>{med.quantity}</td>
              <td>{med.price}</td>
              <td>{med.supplier_name}</td>
              <td>
                <button onClick={() => deleteMedicine(med.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineList;