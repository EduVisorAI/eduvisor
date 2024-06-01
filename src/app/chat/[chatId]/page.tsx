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

const promptTemplates = [
  "Explicame sobre el etanol",
  "Explicame sobre el dioxido de carbono"
];

export default function Page() {
  const auth = useAuth();
  const [, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<
    RenderedConversation | undefined
  >();
  const { chatId } = useParams<{ chatId: string }>();
  const { sendPrompt, conversations } = useContext(AIContext);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (chatId && conversations.find((c) => c.id === chatId)) {
      setConversation(conversations.find((c) => c.id === chatId));
    } else {
      router.push("/");
    }
  }, [chatId, conversations, router]);

  // const onInputChange = (input: string) => {
  //   setError("");
  //   setInput(input);
  // };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  const onTemplateClicked = (template: string) => {
    setInput(template);
  };

  const onInputSubmit = async (prompt: string) => {
    setError("");
    if (prompt.trim().length > 0) {
      try {
        chatEndRef!.current!.scrollIntoView({ behavior: "smooth" });
        setLoading(true);

        await sendPrompt(chatId, prompt, auth?.user?.email as string);
      } catch (err) {
        setError("Vaya... se ha producido un error. Inténtalo de nuevo.");
      }
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <Container>
        {conversation && conversation.speeches.length === 0 && (
          <div className={styles["secondary-section"]}>
            <h2 className={styles["secondary-heading"]}>Prueba con esto</h2>
            <motion.div
              className={styles["prompts-container"]}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {promptTemplates.map((prompt, id) => (
                <button key={id} onClick={() => onTemplateClicked(prompt)}>
                  <Card direction="row">
                    <p className={styles["prompt-text"]}>{prompt}</p>
                  </Card>
                </button>
              ))}
            </motion.div>
          </div>
        )}
        {conversation && conversation.speeches.length > 0 && (
          <div className={styles["chat-container"]}>
            {chatId && (
              <div className="sticky top-0 z-50 md:flex justify-end">
                <Button
                  level="primary"
                  fullWidth={false}
                  clickHandler={() => {
                    window.open(`/display/${chatId}`, "_blank");
                  }}
                >
                  Room {chatId}
                </Button>
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
                    chatId={chatId}
                    speaker={speaker}
                    text={speech.content.answer}
                    cid={speech.content.cid}
                    component={speech.content.component}
                    animate={animate}
                  />
                );
              })}
              {loading && (
                <SpeechBubble
                  speaker="ai"
                  text=""
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
        )}
        <ChatInput inputSubmitHandler={onInputSubmit} submitting={loading} />
      </Container>
    </PrivateRoute>
  );
}
