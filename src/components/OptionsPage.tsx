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
    e.preventDefault();
    return false;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        OpenAI API Key:
        <input
          type="password"
          placeholder={"Put your OpenAI API key here"}
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
