import React, { useEffect } from "react";

function usePreventKeyboardScrollJump() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onFocus() {
      // Whenever input gains focus, prevent page jumping by locking scroll position
      lastScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lastScrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    }

    function onBlur() {
      // On blur restore body scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      // Restore scroll position
      window.scrollTo(0, lastScrollY);
    }

    // Attach focus and blur listeners to all inputs and textarea elements inside chat container
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

    // Also observe DOM changes (optional) for dynamically added inputs
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
      // Reset styles on cleanup
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, []);
}

export default usePreventKeyboardScrollJump;
