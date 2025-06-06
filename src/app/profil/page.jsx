"use client";

import { useEffect, useState } from "react";

export default function PointPage() {
  const [savedPoints, setSavedPoints] = useState(0);

  useEffect(() => {
    const points = Number(localStorage.getItem("savedPoints") || "0");
    setSavedPoints(points);
  }, []);

  return (
    <main className="no-padding">
      <section>
        <h2>Du har {savedPoints} point!</h2>
      </section>
    </main>
  );
}
