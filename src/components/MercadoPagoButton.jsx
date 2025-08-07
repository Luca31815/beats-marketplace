// src/components/MercadoPagoButton.jsx
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ items, email }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);

    const createPref = async () => {
      const res = await fetch("/api/createPreference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email })
      });

      if (!res.ok) {
        const texto = await res.text();
        console.error("⚠️ createPreference falló:", texto);
        return;
      }

      const { preferenceId } = await res.json();
      setPreferenceId(preferenceId);
    };

    createPref();
  }, [items, email]);

  if (!preferenceId) return <p>Cargando pago...</p>;
  return (
    <Payment
      initialization={{ preferenceId }}
      onSubmit={(data) => console.log("Payment data:", data)}
    />
  );
}
