import React from 'react';

interface HeatmapProps {
  availabilityData: Array<{ time: string; availability: number }>;
}

const Heatmap: React.FC<HeatmapProps> = ({ availabilityData }) => {
  const maxAvailability = Math.max(...availabilityData.map(data => data.availability));

  return (
    <div className="heatmap">
      {availabilityData.map((data, index) => (
        <div
          key={index}
          className="heatmap-cell"
          style={{
            height: '30px',
            width: '30px',
            backgroundColor: `rgba(255, 0, 0, ${data.availability / maxAvailability})`,
            display: 'inline-block',
            margin: '1px',
          }}
          title={`Time: ${data.time}, Availability: ${data.availability}`}
        />
      ))}
    </div>
  );
};

export default Heatmap;