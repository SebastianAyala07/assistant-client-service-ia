import "./App.css";
import axios from "axios";
import { useState } from "react";
import 'tailwindcss/tailwind.css';

function App() {
  const [threadId, setThreadId] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:7700/assistant", { message: prompt, thread_id: threadId })
    .then((res) => {
      setResponse(res.data.message);
      console.log(res);
      console.log(res.data);
      setThreadId(res.data.thread_id);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  return (
    <div className="w-[720px] mx-auto py-24">
      <div className="w-full justify-center items-center px-8">
        <form className="w-full text-center" onSubmit={handleSubmit}>
          <div className="md-6">
            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              ¡Estamos para servirte, conversemos!
            </label>
          </div>
          <div className="py-4">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></input>
          </div>
          <div className="md-6">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
        <div className="w-full items-center mt-4">
          <p>{response}</p>
        </div>
      </div>
    </div>
  )
};

export default App;