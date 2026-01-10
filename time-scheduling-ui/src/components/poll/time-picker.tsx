import React from 'react';

interface TimePickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  availableTimes: string[];
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onTimeChange, availableTimes }) => {
  return (
    <div className="time-picker">
      <label htmlFor="time-select" className="block text-sm font-medium text-gray-700">
        Select Time
      </label>
      <select
        id="time-select"
        value={selectedTime}
        onChange={(e) => onTimeChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
      >
        {availableTimes.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;