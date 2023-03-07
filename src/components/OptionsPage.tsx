import React, { useEffect, useState } from "react";

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

  return (
    <div className="bg-blue-200 flex flex-col min-w-[500px] min-h-[300px] h-screen w-screen justify-center items-center">
      <div className="text-center text-2xl uppercase mb-7 font-bold text-blue-400">
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
          value="Submit"
          className="block w-full h-[30px] bg-blue-500 text-white font-bold mt-2 rounded-lg p-2 cursor-pointer"
        />
        <div className="text-sm tracking-wide text-blue-500 mt-3">
          <a href="https://platform.openai.com/account/api-keys">
            Get your API key
          </a>
        </div>
      </form>
    </div>
  );
}
