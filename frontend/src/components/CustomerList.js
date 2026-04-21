import React, { useEffect, useState } from "react";
import API from "../api";

function CustomerList({ refresh }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, [refresh]);

  const fetchCustomers = async () => {
    const res = await API.get("customers/");
    setCustomers(res.data);
  };

  return (
    <div>
      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;