import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OptionsPageProps {}

export default function OptionsPage(props: OptionsPageProps) {
  const [openaiKey, setOpenaiKey] = useState<string>("");

  useEffect(() => {
    chrome.storage.local.get(["openai_key"]).then((result) => {
      if (result.openai_key) {
        console.log("Value is fetched");
        // console.log("Value currently is " + result.openai_key);
        setOpenaiKey(result.openai_key);
      }
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    chrome.storage.local.set({ openai_key: openaiKey }).then(() => {
      console.log("Value is set");
      // console.log("Value is set to " + openaiKey);
    });
    e.preventDefault(); // Stops the page from refreshing (default action of form submit)
  }

  const toastMessage = () => toast.success("Saved. Time to TWEET!");

  return (
    <div className="bg-sky-50 flex flex-col min-w-[500px] min-h-[300px] h-screen w-screen justify-center items-center">
      <div className="text-center text-2xl uppercase mb-5 font-bold text-sky-500">
        OpenAI API Key:
      </div>
      <form onSubmit={handleSubmit} className="w-3/4">
        <input
          type="password"
          placeholder={"Put your OpenAI API key here"}
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
          className="border border-gray-300 shadow p-3 w-full rounded flex items-center"
        />
        <input
          type="submit"
          value="Save API key"
          className="block w-full bg-sky-500 text-white font-bold mt-2 rounded-lg p-2 cursor-pointer"
          onClick={toastMessage}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="text-sm tracking-wide text-sky-500 mt-3 underline decoration-sky-500">
          <a
            target="_blank"
            href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key"
          >
            How do I get my API key?
          </a>
        </div>
        <div className="text-sm tracking-wide text-slate-400 text-center hover:text-slate-500 mt-10 ">
          <a target="_blank" href="https://www.buymeacoffee.com/degrom">
            Getting good tweets? Buy us a coffee!
          </a>
        </div>
      </form>
    </div>
  );
}
