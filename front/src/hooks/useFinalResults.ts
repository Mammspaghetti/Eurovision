import { useEffect, useState } from "react";
import { Artist } from "@/data/artists";

export const useFinalResults = () => {
  const [realResults, setRealResults] = useState<Artist[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/votes/latest");
        const data = await res.json();

        setRealResults(data.results || []);
        setPublished(data.published || false);
      } catch (err) {
        console.error("Error loading final results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { realResults, published, loading };
};