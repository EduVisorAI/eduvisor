/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AIContext } from "../../lib/contexts/ai-context";
import { useRouter, useParams } from "next/navigation";
import styles from "./chat.module.css";
import { RenderedConversation } from "../../lib/chat-gpt/renderer";
import { SpeechBubble } from "../../lib/components/speechBubble/speechBubble";
import { ChatInput } from "../../lib/components/chatInput/chatInput";
import { useAuth } from "../../lib/contexts/authContext/index";
import { Button } from "../../lib/components/button/button";
import { Container } from "@/app/lib/components/container/container";
import PrivateRoute from "@/app/lib/components/private_route";
import { Card } from "@/app/lib/components/card/card";
import { motion } from "framer-motion";
import { AIModel } from "@/app/lib/chat-gpt/models/conversation";

const promptTemplates = [
  { text: "¿Qué es el etanol?", model: AIModel.CHEMICAL },
  { text: "¿Quién pintó la Mona Lisa?", model: AIModel.ART }
];

export default function Page() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState<
    RenderedConversation | undefined
  >();
  const { chatId } = useParams<{ chatId: string }>();
  const { sendPrompt, regeneratePrompt, conversations } = useContext(AIContext);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const convoFound = getConversation();

    if (convoFound) {
      setConversation(conversations.find((c) => c.id === chatId));
    } else {
      router.push("/");
    }
  }, [chatId, conversations, router]);

  const getConversation = () => {
    return conversations.find((c) => c.id === chatId) && chatId;
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

  const handleRegeneratePrompt = async (chatId: string) => {
    setError("");
    try {
      setLoading(true);

      await regeneratePrompt(chatId, auth?.user?.email as string);
    } catch (err) {
      setError("Vaya... se ha producido un error. Inténtalo de nuevo.");
    }
    setLoading(false);
    chatEndRef!.current!.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PrivateRoute>
      <Container>
        {conversation && (
          <>
            <div
              className={`${styles["chat-container"]} ${
                conversation.speeches.length === 0 ? styles["flow-hidden"] : ""
              }`}
            >
              {chatId && (
                <div className={`hidden top-0 z-50 md:flex justify-end gap-2`}>
                  <Button level="primary" fullWidth={false}>
                    Room {chatId}
                  </Button>
                  {conversation.model !== undefined && (
                    <Button level="secondary" fullWidth={false} submitting>
                      {conversation.model ?? ""}
                    </Button>
                  )}
                </div>
              )}

              {conversation.speeches.length === 0 && (
                <div
                  className={`${styles["secondary-section"]} h-full flex flex-col items-center justify-center`}
                >
                  <h2 className={styles["secondary-heading"]}>
                    <b>¿No sabes qué preguntar?</b>
                  </h2>
                  <motion.div
                    className={styles["prompts-container"]}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    {promptTemplates
                      .filter((prompt) => conversation?.model === prompt.model)
                      .map((prompt, id) => (
                        <button
                          key={id}
                          className="min-w-[100px]"
                          onClick={() => {
                            onInputSubmit(prompt.text);
                          }}
                        >
                          <Card direction="row">
                            <p className={styles["prompt-text"]}>
                              {prompt.text}
                            </p>
                          </Card>
                        </button>
                      ))}
                  </motion.div>
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
                      handleRegeneratePrompt={handleRegeneratePrompt}
                      canRegenerate={
                        id === conversation.speeches.length - 1 &&
                        speaker === "ai"
                      }
                      // canRegenerate={false}
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
