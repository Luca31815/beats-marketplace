// src/components/MercadoPagoButton.jsx
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ items, email, amount }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    // Inicializa MercadoPago con tu PUBLIC_KEY
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);

    // Crea la preferencia en tu backend
    const createPref = async () => {
      const res = await fetch("/api/createPreference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email })
      });
      const { preferenceId } = await res.json();
      setPreferenceId(preferenceId);
    };

    createPref();
  }, [items, email]);

  if (!preferenceId) return <p>Cargando pago...</p>;

  return (
    <Payment
      initialization={{ preferenceId, amount }}
      onSubmit={(data) => console.log("Payment data:", data)}
    />
  );
}
