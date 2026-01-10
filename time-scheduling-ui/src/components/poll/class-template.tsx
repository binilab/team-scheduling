import React from 'react';

interface ClassTimeTemplateProps {
  classTimes: { day: string; start: string; end: string }[];
  onSelect: (selectedTimes: { day: string; start: string; end: string }[]) => void;
}

const ClassTimeTemplate: React.FC<ClassTimeTemplateProps> = ({ classTimes, onSelect }) => {
  const handleSelect = (day: string, start: string, end: string) => {
    const selectedTime = { day, start, end };
    onSelect([selectedTime]);
  };

  return (
    <div>
      <h2>Class Time Template</h2>
      <ul>
        {classTimes.map((time, index) => (
          <li key={index}>
            <button onClick={() => handleSelect(time.day, time.start, time.end)}>
              {time.day}: {time.start} - {time.end}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassTimeTemplate;