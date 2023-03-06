import "./index.css";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
import $ from "jquery";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "apikeyhere",
});
const openai = new OpenAIApi(configuration);

const observer = new MutationObserver((mutations) => {
  if (document.querySelector('[data-testid="tweetText"]')) {
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

function setupButtons() {
  const buttonlessTweets = $('[data-testid="tweetText"]')
    .parent()
    .not(":has(.ai_button_wrapper)");
  // $('[data-testid="tweetText"]')
  //   .parent()
  //   .append(
  //     "<div class='ai_button_wrapper flex justify-start'><button type='button' class='ai_button mt-4 rounded-lg p-2 text-white bg-gradient-to-r from-indigo-500 to-red-300 disabled:cursor-progress'>Make AI reply</button></div>"
  //   );
  //text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 fill-gray-500 dark:fill-gray-500
  buttonlessTweets.append(
    `<div class='ai_button_wrapper flex justify-start'><button type='button' class='ai_button mt-4 rounded-lg py-2 px-3 border-2 border-gray-400 dark:border-gray-400 text-gray-500 disabled:cursor-progress fill-gray-500'>${loaderSvg}<span>Copy AI reply</span>${botSvg}</button></div>`
  );
  //TODO catch open ai errors - bad api key and others and toast in response
  // $(".ai_button")
  //   .off()
  buttonlessTweets.find(".ai_button").on("click", async function () {
    const $self = $(this);
    $self.prop("disabled", true);
    $self.data("active", true);
    $self.find(".loader").first().attr("data-active", "true");
    console.log("THOMAS", $self.find(".loader").first());

    const tweetText = $self
      .parent()
      .siblings('[data-testid="tweetText"]')
      .text();

    // const completion = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "The user is trying to network on Twitter. You help the user write replies to other people's tweets.",
    //     },
    //     {
    //       role: "user",
    //       content:
    //         "Write me a reply to the below tweet. Only include the tweet reply in your response:\n" +
    //         tweetText,
    //     },
    //   ],
    // });
    await new Promise((r) => setTimeout(r, 2000));

    // const tweetReply = completion.data.choices[0].message?.content;
    const tweetReply = "deez nuts";

    if (tweetReply) {
      await navigator.clipboard.writeText(tweetReply || "um");
      Toastify({
        text: "Copied your reply to clipboard",

        duration: 3000,
      }).showToast();
    } else {
      Toastify({
        text: "Copied your reply to clipboard",

        duration: 3000,
      }).showToast();
    }
    $self.prop("disabled", false);
    $self.find(".loader").first().attr("data-active", "false");
  });
}
//
// waitForElm('[data-testid="tweetText"]').then((elm) => {
//   const buttonlessTweets = $('[data-testid="tweetText"]')
//     .parent()
//     .not(":has(.ai_button_wrapper)");
//   // $('[data-testid="tweetText"]')
//   //   .parent()
//   //   .append(
//   //     "<div class='ai_button_wrapper flex justify-start'><button type='button' class='ai_button mt-4 rounded-lg p-2 text-white bg-gradient-to-r from-indigo-500 to-red-300 disabled:cursor-progress'>Make AI reply</button></div>"
//   //   );
//   buttonlessTweets.append(
//     "<div class='ai_button_wrapper flex justify-start'><button type='button' class='ai_button mt-4 rounded-lg p-2 text-white bg-gradient-to-r from-indigo-500 to-red-300 disabled:cursor-progress'>Make AI reply</button></div>"
//   );
//
//   $(".ai_button").on("click", async (e) => {
//     const $self = $(e.target);
//     $self.prop("disabled", true);
//
//     const tweetText = $(e.target)
//       .parent()
//       .siblings('[data-testid="tweetText"]')
//       .text();

//     // const completion = await openai.createChatCompletion({
//     //   model: "gpt-3.5-turbo",
//     //   messages: [
//     //     {
//     //       role: "system",
//     //       content:
//     //         "The user is trying to network on Twitter. You help the user write replies to other people's tweets.",
//     //     },
//     //     {
//     //       role: "user",
//     //       content:
//     //         "Write me a reply to the below tweet. Only include the tweet reply in your response:\n" +
//     //         tweetText,
//     //     },
//     //   ],
//     // });

//     await new Promise((r) => setTimeout(r, 2000));
//
//     // const tweetReply = completion.data.choices[0].message?.content;
//     const tweetReply = "deez nuts";
//
//     if (tweetReply) {
//       await navigator.clipboard.writeText(tweetReply || "um");
//       Toastify({
//         text: "Copied your reply to clipboard",
//
//         duration: 3000,
//       }).showToast();
//     } else {
//       Toastify({
//         text: "Copied your reply to clipboard",
//
//         duration: 3000,
//       }).showToast();
//     }
//     $self.prop("disabled", false);
//   });
// });
