import React, { useEffect, useState } from "react";
import API from "../api";

function Dashboard({ refresh }) {
  const [stats, setStats] = useState({
    total_medicines: 0,
    total_suppliers: 0,
    total_customers: 0,
    total_sales: 0,
    revenue: 0,
    low_stock: 0
  });

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  const fetchStats = async () => {
    const res = await API.get("dashboard-stats/");
    setStats(res.data);
  };

  return (
    <div className="stats">
      <div className="stat-box"><h3>{stats.total_medicines}</h3><div className="small">Medicines</div></div>
      <div className="stat-box"><h3>{stats.total_suppliers}</h3><div className="small">Suppliers</div></div>
      <div className="stat-box"><h3>{stats.total_customers}</h3><div className="small">Customers</div></div>
      <div className="stat-box"><h3>{stats.total_sales}</h3><div className="small">Sales</div></div>
      <div className="stat-box"><h3>{stats.revenue}</h3><div className="small">Revenue</div></div>
      <div className="stat-box"><h3>{stats.low_stock}</h3><div className="small">Low Stock</div></div>
    </div>
  );
}

export default Dashboard;