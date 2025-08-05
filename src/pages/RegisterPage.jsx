// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
     const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    else {
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <label>Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label>Contraseña</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Registrarse</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}
