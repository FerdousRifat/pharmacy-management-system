import React, { useEffect, useState } from "react";
import API from "../api";

function SupplierList({ refresh }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, [refresh]);

  const fetchSuppliers = async () => {
    const res = await API.get("suppliers/");
    setSuppliers(res.data);
  };

  return (
    <div>
      <h2>Suppliers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierList;