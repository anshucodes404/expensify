"use client"
import { useEffect, useState } from "react"

export default function Home() {

  const [count, setCount] = useState(0);

    useEffect(() => {
       const saved = localStorage.getItem("count");
       if (saved) {
         setCount(Number(saved));
       }
     }, []);

  function handleCount() {
    setCount(count + 1);
    localStorage.setItem("count", `${count + 1}`);
  }
  
  return (
    <>
      <h1>
        This is an expense tracker app that is named as : Exपेन्सify
      </h1>

      <div>
        <button onClick={handleCount}>
          Clicked : {count}
        </button>
      </div>
    </>
  );
}
