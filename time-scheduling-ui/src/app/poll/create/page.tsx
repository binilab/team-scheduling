import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Select } from '@/components/ui';
import { createPoll } from '@/lib/supabase/client';

const CreatePollPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [duration, setDuration] = useState(30);
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = {
      title,
      dateRange,
      timeRange,
      duration,
      timezone,
      anonymous,
    };
    const { error } = await createPoll(pollData);
    if (!error) {
      router.push('/poll');
    } else {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Date Range (e.g., 1/12 - 1/16)"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          required
        />
        <Input
          label="Time Range (e.g., 10:00 - 22:00)"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          required
        />
        <Select
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
          <option value={90}>90 minutes</option>
        </Select>
        <Select
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option value="Asia/Seoul">Asia/Seoul</option>
          {/* Add more timezones as needed */}
        </Select>
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Allow anonymous participation
        </label>
        <Button type="submit">Create Poll</Button>
      </form>
    </div>
  );
};

export default CreatePollPage;