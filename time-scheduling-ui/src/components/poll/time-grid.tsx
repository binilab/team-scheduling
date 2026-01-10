import React from 'react';

interface TimeGridProps {
  availableSlots: Array<{ time: string; isAvailable: boolean }>;
  onSlotSelect: (time: string) => void;
}

const TimeGrid: React.FC<TimeGridProps> = ({ availableSlots, onSlotSelect }) => {
  return (
    <div className="time-grid">
      {availableSlots.map((slot) => (
        <div
          key={slot.time}
          className={`time-slot ${slot.isAvailable ? 'available' : 'unavailable'}`}
          onClick={() => slot.isAvailable && onSlotSelect(slot.time)}
        >
          {slot.time}
        </div>
      ))}
    </div>
  );
};

export default TimeGrid;