import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-10 rounded-xl shadow-md">
          <h1 className="text-3xl font-semibold text-gray-800">
            Tailwind CSS is working!
          </h1>
        </div>
      </div>
    </>
  );
}

export default App;
