import React, { useState } from "react";
import VectorIcon from 'assets/Right_Arrow_logo.svg';
import InsertIcon from 'assets/Insert_logo.svg';
import RegenerateIcon from 'assets/Regenerate_logo.svg';

// Interface for prompts data structure
interface IPrompts {
    role: 'user' | 'system',
    message: string,
}

// Props interface for PromptModal component
interface PromptModalProps {
    open: boolean;
    handleClose: () => void;
}

// Component definition
const PromptModal: React.FC<PromptModalProps> = ({ open, handleClose }) => {
    // State for storing prompts and user input
    const [prompts, setPrompts] = useState<IPrompts[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>("");

    // Function to generate prompts
    const handleGenerate = () => {
        if (userPrompt && userPrompt.length > 0) {
            const data: IPrompts[] = [
                {
                    role: "user",
                    message: userPrompt
                },
                {
                    role: "system",
                    message: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
                }
            ];
            setPrompts(prev => [...prev, ...data]);
        }
        setUserPrompt("");
    }

    // Function to insert selected prompt into text box
    const handleInsert = () => {
        const textBox = document.querySelector(".msg-form__contenteditable") as HTMLDivElement | null;
        if (textBox) {
            textBox.textContent = prompts[prompts.length - 1]?.message;
            const range = document.createRange();
            range.selectNodeContents(textBox);
            range.collapse(false);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        setUserPrompt("");
        setPrompts([]);
        handleClose();
    }

    // If modal is not open, return null
    if (!open) return null;

    // Render the modal component
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-[600px] max-w-full space-y-6">
                <div className="flex flex-col items-center">
                    {prompts && prompts.length > 0 && prompts.map((prompt, index) => (
                        <div
                            key={index}
                            className={`self-${prompt.role === "user" ? 'end' : 'start'} text-xl font-normal text-gray-600 ${prompt.role === "user" ? 'bg-gray-200' : 'bg-blue-100'} p-4 mb-4 rounded-md w-full`}
                        >
                            {prompt.message}
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder="Enter Your prompt here..."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="text-base rounded-lg p-4 mb-4 border-2 border-gray-300 focus:border-blue-500 w-full"
                    />
                    {prompts && prompts.length === 0 ? (
                        <div className="flex justify-end w-full">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                className="bg-blue-700 text-white text-base font-semibold rounded-lg py-2 px-6 mt-4 flex items-center justify-center space-x-2"
                            >
                                <img src={VectorIcon} alt="icon" className="w-5 h-5" />
                                <span>Generate</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-2 w-full">
                            <button
                                type="button"
                                onClick={handleInsert}
                                className="text-gray-600 border-2 border-gray-600 text-base font-semibold rounded-lg py-2 px-6 mt-4 flex items-center justify-center space-x-2"
                            >
                                <img src={InsertIcon} alt="icon" className="w-4 h-4" />
                                <span>Insert</span>
                            </button>
                            <button
                                type="button"
                                className="bg-blue-700 text-white text-base font-semibold rounded-lg py-2 px-6 mt-4 flex items-center justify-center space-x-2"
                            >
                                <img src={RegenerateIcon} alt="icon" className="w-4.5 h-4.5" />
                                <span>Regenerate</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromptModal;
