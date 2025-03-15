import React, { useEffect, useState } from "react";
import CatagoryTable from "../../components/dashboardComponents/CatagoryTable";
import MetricCard from "../../components/dashboardComponents/MetricCard";

const Dashboard = () => {

  const [metrics, setMetrics] = useState([]);




  const fetchData = async () => {

    try {

      const cupboardRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cupboards/getCupboardCount`, { method: "GET" });
      const costumeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostumesCount`, { method: "GET" });
      if (cupboardRes.ok && costumeRes.ok) {
        const cupboardCount = await cupboardRes.json();
        const costumeCount = await costumeRes.json();


        setMetrics([
          {
            title: "Total cupboards",
            value: cupboardCount.message.count,
            color: "bg-gradient-to-r from-blue-400 to-blue-500"
          },
          {
            title: "Total costumes",
            value: costumeCount.message.count,
            color: "bg-gradient-to-r from-emerald-400 to-emerald-500"
          },
        ])
      }





    } catch (err) {
      console.log("Your err is : ", err)
    }


  }

  useEffect(() => {
    fetchData();
  }, [])






  // const metrics = [
  //   {
  //     title: "Total costumes",
  //     value: "34",
  //     color: "bg-gradient-to-r from-blue-400 to-blue-500"
  //   },

  //   {
  //     title: "Availabel costume",
  //     value: "24",
  //     color: "bg-gradient-to-r from-amber-400 to-amber-500"
  //   },
  //   {
  //     title: "Total cupboards",
  //     value: "45",
  //     color: "bg-gradient-to-r from-emerald-400 to-emerald-500"
  //   },
  //   {
  //     title: "Rented Costume",
  //     value: "12",
  //     color: "bg-gradient-to-r from-pink-400 to-pink-500"
  //   }
  // ];


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {/* <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Screen Options ▼
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
            Help ▼
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ">

        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            color={metric.color}
          />
        ))}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 items-stretch mt-8">
        <CatagoryTable />
        
      </div>


    </div>
  );
};

export default Dashboard;
