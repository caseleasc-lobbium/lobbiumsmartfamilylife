"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DealForm from "../../DealForm";

export default function EditDealPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/deals/${id}`);
        if (!res.ok) return setState("error");
        setDeal(await res.json());
        setState("ok");
      } catch { setState("error"); }
    })();
  }, [id]);

  if (state === "loading") return <div className="p-10 text-center text-gray-500">🔄 Lade Deal…</div>;
  if (state === "error") return <div className="p-10 text-center text-red-500">Deal nicht gefunden.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-5 px-1">Deal bearbeiten</h1>
      <DealForm initial={deal} dealId={id} />
    </div>
  );
}
