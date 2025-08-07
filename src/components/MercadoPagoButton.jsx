// F:\PROYECTOS\BEATS-MARKETPLACE\src\components\MercadoPagoButton.jsx
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ items, email }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);

    async function createPref() {
      const res = await fetch("/api/createPreference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email }),
      });
      if (!res.ok) {
        console.error("⚠️ createPreference falló:", await res.text());
        return;
      }
      const { preferenceId } = await res.json();
      setPreferenceId(preferenceId);
    }

    createPref();
  }, [items, email]);

  if (!preferenceId) return <p>Cargando pago…</p>;
  return (
    <Payment
      initialization={{ preferenceId }}
      onSubmit={(data) => console.log("Payment data:", data)}
    />
  );
}
