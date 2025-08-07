// src/components/MercadoPagoButton.jsx
import { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ items, email }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);

    async function createPref() {
      let res;
      try {
        res = await fetch("/api/createPreference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, email }),
        });
      } catch (err) {
        console.error("❌ Error al conectar con la API:", err);
        return;
      }

      // Si nos devuelve 405, intentamos un GET para ver el mensaje
      if (res.status === 405) {
        console.warn("⚠️ Método POST no permitido, haciendo fallback a GET…");
        const getRes = await fetch("/api/createPreference");
        const info = await getRes.json();
        console.log("ℹ️ Respuesta al GET:", info);
        return;
      }

      const text = await res.text();
      console.log("⚙️ createPreference raw response:", text);

      if (!res.ok) {
        console.error("⚠️ createPreference falló:", text);
        return;
      }

      const { preferenceId } = JSON.parse(text);
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
