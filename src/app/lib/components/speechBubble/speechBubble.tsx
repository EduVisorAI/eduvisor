import React from "react";
import styles from "./speechBubble.module.css";
import Loader from "../../../../../public/loading.gif";
import { motion } from "framer-motion";
import { AIModel } from "../../chat-gpt/models/conversation";
import { RenderedSpeech } from "../../chat-gpt/renderer";
import { ChemicalAnswer } from "../knowledgeAreas/chemical/ChemicalAnswer";
import { ArtAnswer } from "../knowledgeAreas/art/ArtAnswer";

export const SpeechBubble: React.FC<{
  chatId?: string;
  model?: AIModel;
  speaker?: string;
  speech: RenderedSpeech;
  handleRegeneratePrompt?: (chatId: string) => void;
  canRegenerate?: boolean;
  loading?: boolean;
  animate: boolean;
  delay?: number;
}> = (props) => {
  let speechBubbleClass: string;
  let containerClass: string;
  const {
    chatId,
    model,
    speaker,
    speech,
    handleRegeneratePrompt,
    canRegenerate,
    loading,
    animate,
    delay
  } = props;

  if (speaker === "ai") {
    speechBubbleClass = "ai";
    containerClass = "ai-container";
  } else {
    speechBubbleClass = "user";
    containerClass = "user-container";
  }

  const UserBubble = () => {
    const content = loading ? (
      <img src={Loader.src} width={40} alt="Loading" />
    ) : (
      <p className="font-bold">{speech.content.answer}</p>
    );

    return (
      <div className="flex gap-2 items-center">
        <img src="/profile.png" className="block" />
        <div className={styles[speechBubbleClass]}>{content}</div>
      </div>
    );
  };

  const AIBubble = () => {
    const content = loading ? (
      <img src={Loader.src} width={40} alt="Loading" />
    ) : (
      <>
        {model === AIModel.CHEMICAL ? (
          <ChemicalAnswer
            speech={speech}
            chatId={chatId!}
            canRegenerate={canRegenerate!}
            handleRegeneratePrompt={handleRegeneratePrompt!}
          />
        ) : (
          <ArtAnswer
            speech={speech}
            chatId={chatId!}
            canRegenerate={canRegenerate!}
            handleRegeneratePrompt={handleRegeneratePrompt!}
          />
        )}
      </>
    );

    return (
      <div className={styles[speechBubbleClass]}>
        <div className="flex gap-2 mb-2">
          <p className="text-[#5661F6] text-sm font-bold">EduVisorAI</p>
          <img src="/arrow-up-left-contained.png" className="object-contain" />
        </div>
        {content}
      </div>
    );
  };

  if (animate) {
    return (
      <motion.div
        className={styles[containerClass]}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.5, delay: delay ? delay : 0 }}
      >
        {speaker === "user" ? <UserBubble /> : <AIBubble />}
      </motion.div>
    );
  } else {
    return (
      <div className={styles[containerClass]}>
        {speaker === "user" ? <UserBubble /> : <AIBubble />}
      </div>
    );
  }
};
