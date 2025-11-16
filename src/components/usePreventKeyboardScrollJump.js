import { useEffect } from "react";

function usePreventKeyboardScrollJump() {
  useEffect(() => {
    let lastScrollY = window.scrollY;

    function onFocus() {
      lastScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lastScrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    }

    function onBlur() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, lastScrollY);
    }

    const chatContainer = document.querySelector("#root");
    if (!chatContainer) return;

    function attachListeners() {
      const inputs = chatContainer.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.addEventListener("focus", onFocus);
        input.addEventListener("blur", onBlur);
      });
    }

    attachListeners();

    const observer = new MutationObserver(() => {
      attachListeners();
    });
    observer.observe(chatContainer, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const inputs = chatContainer.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.removeEventListener("focus", onFocus);
        input.removeEventListener("blur", onBlur);
      });
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, []);
}

export default usePreventKeyboardScrollJump;
