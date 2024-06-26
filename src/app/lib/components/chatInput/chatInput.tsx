import { useEffect, useState } from "react";
import { Button } from "../button/button";
import styles from "./chatInput.module.css";
import { motion } from "framer-motion";
import { HiOutlineMicrophone } from "react-icons/hi2";
import useSpeechRecognition from "../../hooks/useSpeechRecognitionHook";

export const ChatInput: React.FC<{
  inputSubmitHandler: (prompt: string) => void;
  submitting: boolean;
}> = (props) => {
  const [input, setInput] = useState("");
  const {
    transcript,
    startListening,
    stopListening,
    isListening,
    hasRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setInput((prev) => prev + transcript);
  }, [transcript]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.inputSubmitHandler(input);
    setInput("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.form
      className={styles["container"]}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <div
        className={
          props.submitting ? styles["disabled-input"] : styles["input"]
        }
        style={{
          outlineColor: "#999999",
          outlineWidth: "2px"
        }}
      >
        <textarea
          placeholder={`¿Que estás pensando?...`}
          value={input}
          rows={1}
          onChange={handleInputChange}
          onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              setInput(""); // clear the input
              props.inputSubmitHandler(input);
            }
          }}
          disabled={props.submitting}
          className="w-full h-full p-2 bg-transparent border-none focus:outline-none"
          style={{ resize: "none" }}
        />
        <div className="disabled:opacity-10 right-4 [flex:none]">
          <div className="flex gap-2">
            <Button
              clickHandler={toggleListening}
              level="primary"
              fullWidth={false}
              rounded={true}
              submitting={props.submitting}
              preventDefault={true}
            >
              <HiOutlineMicrophone
                className={`w-5 h-5 ${
                  isListening ? "text-red-500" : "text-current"
                }`}
              />
            </Button>
            <Button
              level="primary"
              fullWidth={false}
              rounded={true}
              submitting={props.submitting}
            >
              <img src="/send.png" className={`w-5 h-5`} />
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};
