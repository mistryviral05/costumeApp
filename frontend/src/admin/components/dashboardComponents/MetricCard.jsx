import React from 'react'


const MetricCard = ({ title, value, color }) => {
    return (
      <div className={`p-4 rounded-lg ${color} shadow-lg w-full`}>
        <div className="flex flex-col">
          <span className="text-white/80 text-sm font-medium">{title}</span>
          <span className="text-white text-2xl font-bold mt-1">{value}</span>
        </div>
      </div>
    );
  };

export default  MetricCard