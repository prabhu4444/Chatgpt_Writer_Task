import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState } from "react";
import PromptModal from "~components/PromptModal";
import AiIcon from "assets/main_logo.svg";

// Configuration for the Plasmo content script
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

// Inject custom CSS
export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
}

// Interface for the PromptModal component props
interface PromptModalProps {
  open: boolean;
  handleClose: () => void;
}

const Content: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Effect to add event listeners to the LinkedIn message input box
  useEffect(() => {
    const intervalId = setInterval(() => {
      const textBox = document.querySelector(".msg-form__contenteditable");
      if (textBox) {
        textBox.addEventListener("focus", handleTextBoxFocus);
        textBox.addEventListener("blur", handleTextBoxBlur);
        clearInterval(intervalId); // Stop checking once the input box is found
      }
    }, 1000); // Check every second

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Method to show AI icon on input box focus
  const handleTextBoxFocus = () => {
    const textBox = document.querySelector(".msg-form__contenteditable");
    if (textBox) {
      const aiIconContainer = document.createElement("div");
      aiIconContainer.className = "ai-icon";
      aiIconContainer.style.position = "absolute";
      aiIconContainer.style.bottom = "0";
      aiIconContainer.style.right = "0";

      const imgElement = document.createElement("img");
      imgElement.src = AiIcon;
      imgElement.alt = "AI Icon";
      imgElement.style.width = "32px";
      imgElement.style.height = "32px";
      imgElement.style.cursor = "pointer";
      imgElement.addEventListener("click", () => {
        setIsModalVisible(true);
      });

      aiIconContainer.appendChild(imgElement);
      textBox.appendChild(aiIconContainer);
    }
  };

  // Method to remove AI icon on input box blur
  const handleTextBoxBlur = () => {
    const textBox = document.querySelector(".msg-form__contenteditable");
    const aiIconContainer = textBox?.querySelector(".ai-icon"); 
    aiIconContainer?.remove();
  };

  return (
    <div>
      <PromptModal open={isModalVisible} handleClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default Content;