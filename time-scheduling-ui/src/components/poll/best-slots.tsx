import React from 'react';

interface BestSlotsProps {
  slots: Array<{
    time: string;
    participants: number;
  }>;
}

const BestSlots: React.FC<BestSlotsProps> = ({ slots }) => {
  return (
    <div className="best-slots">
      <h2>Best Time Slots</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot.time} - {slot.participants} participants available
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestSlots;