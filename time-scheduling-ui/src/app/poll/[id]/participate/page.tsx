import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPollDetails, submitParticipation } from '../../../lib/supabase/client'; // Adjust the import based on your actual client structure
import TimeGrid from '../../../components/poll/time-grid';
import Button from '../../../components/ui/button';

const ParticipatePoll = () => {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPollDetails = async () => {
      if (id) {
        const pollDetails = await fetchPollDetails(id);
        setPoll(pollDetails);
        setLoading(false);
      }
    };
    getPollDetails();
  }, [id]);

  const handleAvailabilityChange = (timeSlot) => {
    setAvailability((prev) => ({
      ...prev,
      [timeSlot]: !prev[timeSlot],
    }));
  };

  const handleSubmit = async () => {
    await submitParticipation(id, availability);
    router.push(`/poll/${id}/result`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Participate in Poll: {poll.title}</h1>
      <TimeGrid availability={availability} onChange={handleAvailabilityChange} />
      <Button onClick={handleSubmit}>Submit Availability</Button>
    </div>
  );
};

export default ParticipatePoll;