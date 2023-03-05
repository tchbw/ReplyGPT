import "./index.css";
import "toastify-js/src/toastify.css";
import $ from "jquery";

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

waitForElm(".DraftEditor-editorContainer").then((elm) => {
  // const tweetButton = document.querySelector(
  //   '[data-testid="tweetButtonInline"]'
  // );
  // const tweetText = document.querySelector(
  //   '[data-testid="tweetText"] > span'
  // )?.textContent;
  //
  // if (tweetButton && tweetText) {
  //   tweetButton.insertAdjacentHTML(
  //     "beforebegin",
  //     "<div id='ai_button' role='button' class='rounded-lg p-2 text-white bg-gradient-to-r from-indigo-500 to-red-300'>Use AI</div>"
  //   );
  //
  //   $("#ai_button").on("click", function () {
  //     const $self = $(this);
  //     console.log("Disabled");
  //     $self.prop("disabled", true);
  //     doSomething().then(function () {
  //       $self.prop("disabled", false);
  //       console.log("Enabled");
  //     });
  //   });
  // }
  //
  // document.querySelector(".DraftEditor-editorContainer span");
  // document.querySelector('[data-testid="tweetButtonInline"]');
  //
  // const draftPlaceholder = document.querySelector(
  //   ".public-DraftEditorPlaceholder-root"
  // );
  //
  // if (draftPlaceholder) {
  //
  //   draftPlaceholder.remove();
  // }
});
