import { useState } from "react";
import { Button } from "../button/button";
import styles from "./chatInput.module.css";
import { motion } from "framer-motion";

export const ChatInput: React.FC<{
  inputSubmitHandler: (prompt: string) => void;
  submitting: boolean;
}> = (props) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.inputSubmitHandler(input);
    setInput('');
  };

  return (
    <motion.form
      className={styles["container"]}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <textarea
        placeholder="¿Que estás pensando?..."
        value={input}
        rows={1}
        onChange={handleInputChange}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setInput(''); // clear the input
            props.inputSubmitHandler(input);
          }
        }}
        style={{
          resize: "none",
          outlineColor: "#999999",
          outlineWidth: "2px"
        }}
        className={
          props.submitting ? styles["disabled-input"] : styles["input"]
        }
        disabled={props.submitting}
      />
      <div className="absolute disabled:opacity-10 right-4">
        <Button
          level="primary"
          fullWidth={false}
          rounded={true}
          submitting={props.submitting}
        >
          <img src="/send.png" className={`w-5 h-5`} />
        </Button>
      </div>
    </motion.form>
  );
};
