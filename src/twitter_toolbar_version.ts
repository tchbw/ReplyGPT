import "./index.css";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
import $ from "jquery";

import { Configuration, OpenAIApi } from "openai";

async function getChatGPTResponse(
  tweetText: string,
  openai_key: string,
  tone: "default" | "drunk" | "mad" | "joke" = "default"
) {
  const configuration = new Configuration({
    apiKey: openai_key,
  });
  const openai = new OpenAIApi(configuration);

  let prompt: { role: "system" | "assistant" | "user"; content: string }[] = [
    {
      role: "system",
      content:
        "The user is trying to network on Twitter. You help the user write replies to other people's tweets.",
    },
  ];
  switch (tone) {
    case "joke":
      prompt = [
        {
          role: "system",
          content:
            "The user is a funny guy networking on Twitter. He loves to use jokes in his replies. You help the user write replies to other people's tweets.",
        },
      ];
      break;
    case "drunk":
      prompt = [
        {
          role: "system",
          content:
            "The user is drunk and he wants to mess up with people on twitter. He want to be funny and silly. You help the user write replies to other people's tweets.",
        },
        {
          role: "user",
          content:
            "Write me a reply to the below tweet. Only include the tweet reply in your response:\n" +
            "Why do seagulls fly over the sea?",
        },
        {
          role: "assistant",
          content: "Because if they flew over the bay they'd be Bagel.",
        },
      ];
      break;
    case "mad":
      prompt = [
        {
          role: "system",
          content:
            "The user is feeling angry and frustrated with the world. They want to express their anger in their replies to other people's tweets.",
        },
        {
          role: "user",
          content:
            "Reply to the tweet with frustration and anger. Show that what he said can make people really mad and upset. Be a bitch!",
        },
      ];
      break;
    default:
      break;
  }

  prompt.push({
    role: "user",
    content:
      "Write me a reply to the below tweet. Only include the tweet reply in your response:\n" +
      tweetText,
  });
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
  });

  return completion.data.choices[0].message?.content;
}

function handleOpenAIError(e: any) {
  console.log("OPEN AI Error resp status", e?.response?.status);
  let toastErrorText =
    "Hmm something went wrong getting an AI suggestion. Try again?";
  if (e?.response?.status === 401) {
    toastErrorText =
      "Your API key didn't work. Check that you used the right key and set it in the extension options.";
  }

  Toastify({
    text: toastErrorText,
    duration: 7000,
    style: { background: "#b91c1c" },
  }).showToast();
}

function getFeaturedTweet() {
  const tweetModal = document.querySelector('[aria-labelledby="modal-header"]');
  if (tweetModal) {
    const tweet =
      tweetModal.querySelector('[data-testid="tweetText"]') ||
      tweetModal.querySelector('[data-testid="tweet"]');
    return tweet;
  } else {
    const tweets = Array.from(
      document.querySelectorAll('[data-testid="tweetText"]')
    );
    // Main tweet is larger text size
    // This is so hacky but whatever
    const largeTweet = tweets.find(
      (t) => parseInt(getComputedStyle(t).fontSize) >= 17
    );
    return largeTweet;
  }
}

(async () => {
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('[data-testid="toolBar"]')) {
      setupButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const loaderSvg =
    '<svg class="animate-spin loader hidden data-[active=true]:inline-block mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z"></path></svg>';

  const botSvg =
    '<svg class=\'inline-block ml-2 mb-1\' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M21 10.975V8a2 2 0 0 0-2-2h-6V4.688c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5a2 2 0 0 0-2 2v2.998l-.072.005A.999.999 0 0 0 2 12v2a1 1 0 0 0 1 1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a1 1 0 0 0 1-1v-1.938a1.004 1.004 0 0 0-.072-.455c-.202-.488-.635-.605-.928-.632zM7 12c0-1.104.672-2 1.5-2s1.5.896 1.5 2-.672 2-1.5 2S7 13.104 7 12zm8.998 6c-1.001-.003-7.997 0-7.998 0v-2s7.001-.002 8.002 0l-.004 2zm-.498-4c-.828 0-1.5-.896-1.5-2s.672-2 1.5-2 1.5.896 1.5 2-.672 2-1.5 2z"></path></svg>';

  const madSvg =
    '<svg class=\'inline-block ml-2 mb-1\' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:;transform: ;msFilter:;"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-5 8.5.002-.022-1.373-.549.742-1.857 5 2-.742 1.857-1.031-.413c-.014.014-.023.031-.037.044A1.499 1.499 0 0 1 7 10.5zM8 17s1-3 4-3 4 3 4 3H8zm8.986-6.507c0 .412-.167.785-.438 1.056a1.488 1.488 0 0 1-2.112 0c-.011-.011-.019-.024-.029-.035l-1.037.415-.742-1.857 5-2 .742 1.857-1.386.554a.036.036 0 0 1 .002.01z"></path></svg>';

  const jokeSvg =
    '<svg class=\'inline-block ml-2 mb-1\' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:;transform: ;msFilter:;"><path d="M14 19v-4h-4v4c0 1.103.897 2 2 2s2-.897 2-2z"></path><path d="M12 2C6.486 2 2 6.486 2 12c0 4.434 2.903 8.198 6.906 9.505A3.969 3.969 0 0 1 8 19v-2.499C6.412 15.027 6 13 6 13h12s-.411 2.027-2 3.501V19c0 .953-.349 1.816-.906 2.504C19.097 20.197 22 16.434 22 12c0-5.514-4.486-10-10-10zm-3.5 9a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 8.5 11zm4.5 0s.5-2 2.5-2c1.999 0 2.5 2 2.5 2h-5z"></path></svg>';

  const drunkSvg =
    '<svg class=\'inline-block ml-2 mb-1\' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:;transform: ;msFilter:;"><path d="M20 6h-2V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v15c0 1.654 1.346 3 3 3h10c1.654 0 3-1.346 3-3v-1h2c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zM8 17H6V7h2v10zm6 0h-2V7h2v10zm6-1h-2V8h2v8z"></path></svg>';
  function setupButtons() {
    const tweet = getFeaturedTweet();
    // This stops the write tweet button from having the ai buttons
    if (!tweet) {
      $(".ai_button_wrapper").remove();
      return;
    }
    const buttonlessTweets = $('[data-testid="toolBar"]')
      .parent()
      .not(":has(.ai_button_wrapper)");

    buttonlessTweets.prepend(
      `<div class='ai_button_wrapper flex justify-start text-gray-500 items-center mt-4 gap-2'>
           <div>AI replies:</div>
           <button type='button' data-tone="default" class='ai_button  text-sm rounded-lg py-1 px-2 border-2 border-gray-400 dark:border-gray-400 disabled:cursor-progress fill-gray-500'>${loaderSvg}<span>Default</span>${botSvg}</button>
           <button type='button' data-tone="joke" class='ai_button  text-sm rounded-lg py-1 px-2 border-2 border-gray-400 dark:border-gray-400 disabled:cursor-progress fill-gray-500'>${loaderSvg}<span>Joke</span>${jokeSvg}</button>
           <button type='button' data-tone="mad" class='ai_button  text-sm rounded-lg py-1 px-2 border-2 border-gray-400 dark:border-gray-400 disabled:cursor-progress fill-gray-500'>${loaderSvg}<span>Angry</span>${madSvg}</button>
           <button type='button' data-tone="drunk" class='ai_button  text-sm rounded-lg py-1 px-2 border-2 border-gray-400 dark:border-gray-400 disabled:cursor-progress fill-gray-500'>${loaderSvg}<span>Drunk</span>${drunkSvg}</button>
      </div>`
    );

    buttonlessTweets.find(".ai_button").on("click", async function () {
      const result = await chrome.storage.local.get(["openai_key"]);
      if (!result.openai_key) {
        await chrome.runtime.sendMessage("showOptions");
        return;
      }

      const $self = $(this);
      $self.prop("disabled", true);
      $self.data("active", true);
      $self.find(".loader").first().attr("data-active", "true");

      const tweetText = tweet ? $(tweet).text() : "";

      const tone = $self.data("tone");
      try {
        const tweetReply = await getChatGPTResponse(
          tweetText,
          result.openai_key,
          tone
        );

        // await new Promise((r) => setTimeout(r, 2000));
        // const tweetReply = "deez nuts";

        if (tweetReply) {
          const i = document.querySelector('[data-testid="tweetTextarea_0"]'),
            r = new DataTransfer();
          r.setData("text/plain", tweetReply),
            null == i ||
              i.dispatchEvent(
                new ClipboardEvent("paste", {
                  dataType: "text/plain",
                  data: tweetReply,
                  bubbles: !0,
                  clipboardData: r,
                  cancelable: !0,
                })
              );
          await navigator.clipboard.writeText(tweetReply || "um");
          Toastify({
            text: "Added reply",

            duration: 3000,
          }).showToast();
        } else {
          throw new Error("Unknown error");
        }
      } catch (e: any) {
        handleOpenAIError(e);
      }

      $self.prop("disabled", false);
      $self.find(".loader").first().attr("data-active", "false");
    });
  }
})();
