import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase/client';

const ResultPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pollResults, setPollResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPollResults = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPollResults(data);
      }
      setLoading(false);
    };

    fetchPollResults();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Poll Results for {pollResults.title}</h1>
      <div>
        <h2>Results:</h2>
        <ul>
          {pollResults.results.map((result, index) => (
            <li key={index}>
              {result.option}: {result.votes} votes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultPage;