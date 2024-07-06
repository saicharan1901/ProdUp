"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:5000/vasi');
      const text = await response.text();
      setData(text);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetch from Flask API</h1>
      <p>{data}</p>
    </div>
  );
}
