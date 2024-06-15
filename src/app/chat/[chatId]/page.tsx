/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AIContext } from "../../lib/contexts/ai-context";
import { useRouter, useParams } from "next/navigation";
import styles from "./chat.module.css";
import { RenderedConversation } from "../../lib/chat-gpt/renderer";
import { motion } from "framer-motion";
import { SpeechBubble } from "../../lib/components/speechBubble/speechBubble";
import { ChatInput } from "../../lib/components/chatInput/chatInput";
import { Card } from "../../lib/components/card/card";
import { useAuth } from "../../lib/contexts/authContext/index";
import { Button } from "../../lib/components/button/button";
import { Container } from "@/app/lib/components/container/container";
import PrivateRoute from "@/app/lib/components/private_route";
import { AIModel } from "@/app/lib/chat-gpt/models/conversation";

const promptTemplates = [
  { text: "QUIMICA 🧪", model: AIModel.CHEMICAL },
  { text: "ARTE 🎨", model: AIModel.ART }
];

export default function Page() {
  const auth = useAuth();
  const [temporalChat, setTemporalChat] = useState(true);
  const [, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { newConvo } = useContext(AIContext);
  const [conversation, setConversation] = useState<
    RenderedConversation | undefined
  >();
  const { chatId } = useParams<{ chatId: string }>();
  const { sendPrompt, conversations } = useContext(AIContext);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const convoFound = getConversation();

    if (convoFound) {
      setConversation(conversations.find((c) => c.id === chatId));
      setTemporalChat(false);
    } else if (!temporalChat) {
      router.push("/");
    }
  }, [chatId, conversations, router, temporalChat]);

  const getConversation = () => {
    return conversations.find((c) => c.id === chatId) && chatId;
  };

  const onTemplateClicked = (template: AIModel) => {
    console.log("template", template);
    newConvo(chatId, template);
  };

  const onInputSubmit = async (prompt: string) => {
    setError("");
    if (prompt.trim().length > 0) {
      try {
        setLoading(true);

        await sendPrompt(chatId, prompt, auth?.user?.email as string);
      } catch (err) {
        setError("Vaya... se ha producido un error. Inténtalo de nuevo.");
      }
      setLoading(false);
      chatEndRef!.current!.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PrivateRoute>
      <Container>
        {temporalChat && (
          <div className={styles["secondary-section"]}>
            <h2 className={styles["secondary-heading"]}>
              Elige un area de conocimiento
            </h2>
            <motion.div
              className={styles["prompts-container"]}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {promptTemplates.map((prompt, id) => (
                <button
                  key={id}
                  className="min-w-[100px]"
                  onClick={() => onTemplateClicked(prompt.model)}
                >
                  <Card direction="row">
                    <p className={styles["prompt-text"]}>{prompt.text}</p>
                  </Card>
                </button>
              ))}
            </motion.div>
          </div>
        )}
        {conversation && (
          <>
            <div className={styles["chat-container"]}>
              {chatId && (
                <div className="hidden  top-0 z-50 md:flex justify-end gap-2">
                  <Button
                    level="primary"
                    fullWidth={false}
                    clickHandler={() => {
                      window.open(`/display/${chatId}`, "_blank");
                    }}
                  >
                    Room {chatId}
                  </Button>
                  {conversation.model !== undefined && (
                    <Button level="secondary" fullWidth={false} submitting>
                      {conversation.model ?? ""}
                    </Button>
                  )}
                </div>
              )}
              <div>
                {conversation.speeches.map((speech, id) => {
                  const speaker = speech.speaker === "HUMAN" ? "user" : "ai";
                  let animate = false;
                  if (id === conversation.speeches.length - 1) {
                    animate = true;
                  }

                  return (
                    <SpeechBubble
                      key={id}
                      speaker={speaker}
                      chatId={chatId}
                      model={conversation.model}
                      speech={speech}
                      animate={animate}
                    />
                  );
                })}
                {loading && (
                  <SpeechBubble
                    speech={{
                      speaker: "",
                      content: { answer: "" }
                    }}
                    loading={true}
                    animate={true}
                    delay={0.5}
                  />
                )}
                {error && (
                  <div className={styles["error-container"]}>{error}</div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            <ChatInput
              inputSubmitHandler={onInputSubmit}
              submitting={loading}
            />
          </>
        )}
      </Container>
    </PrivateRoute>
  );
}
