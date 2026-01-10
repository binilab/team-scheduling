import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPollById } from '../../../lib/supabase/client'; // Adjust the import path as necessary
import PollDetails from '../../../components/poll/PollDetails'; // Adjust the import path as necessary
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Adjust the import path as necessary

const PollPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const getPoll = async () => {
        try {
          const data = await fetchPollById(id);
          setPoll(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      getPoll();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {poll ? <PollDetails poll={poll} /> : <div>No poll found.</div>}
    </div>
  );
};

export default PollPage;