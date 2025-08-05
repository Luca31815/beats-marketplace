import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestConnection() {
  const [beats, setBeats] = useState([]);

  useEffect(() => {
    supabase
      .from('beats')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setBeats(data);
      });
  }, []);

  return (
    <div>
      <h1>Beats disponibles</h1>
      <pre>{JSON.stringify(beats, null, 2)}</pre>

      <MercadoPagoButton
        beatId={beat.id}
        beatTitle={beat.title}
        beatPrice={beat.price}
        userEmail={user.email}
      />
    </div>
  );
}
