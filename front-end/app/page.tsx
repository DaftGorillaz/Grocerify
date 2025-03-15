// app/page.tsx
'use client';

import React, { useState } from 'react';

interface SearchResult {
  // Define properties based on the data returned from your Flask API
  product_size?: string;
  current_price?: number;
  price_per_unit?: number;
  // Add other properties as needed
}

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [supermarket, setSupermarket] = useState<string>('woolworths');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/search?supermarket=${supermarket}&query=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await res.json();
      // If your API returns an object with a `results` property,
      // adjust the assignment below accordingly (e.g., setResults(data.results)).
      setResults(data.results || data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Product Search</h1>
      <form onSubmit={handleSearch}>
        <label>
          Supermarket:
          <select
            value={supermarket}
            onChange={(e) => setSupermarket(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="woolworths">Woolworths</option>
            <option value="coles">Coles</option>
          </select>
        </label>
        <br />
        <label>
          Search Query:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., apple"
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
