import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import MedicineForm from "./components/MedicineForm";
import MedicineList from "./components/MedicineList";
import SupplierForm from "./components/SupplierForm";
import SupplierList from "./components/SupplierList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import SaleForm from "./components/SaleForm";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reload = () => setRefresh(!refresh);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Dashboard refresh={refresh} />
        <div className="grid">
          <div className="card">
            <MedicineForm onSuccess={reload} />
          </div>
          <div className="card">
            <SupplierForm onSuccess={reload} />
          </div>
          <div className="card">
            <CustomerForm onSuccess={reload} />
          </div>
          <div className="card full">
            <SaleForm onSuccess={reload} />
          </div>
          <div className="card full">
            <MedicineList refresh={refresh} />
          </div>
          <div className="card">
            <SupplierList refresh={refresh} />
          </div>
          <div className="card">
            <CustomerList refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;