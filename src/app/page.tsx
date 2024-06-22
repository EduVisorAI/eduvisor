"use client";
import styles from "../app/chat/[chatId]/chat.module.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import React from "react";
import { AIContext } from "./lib/contexts/ai-context";
import ShortUniqueId from "short-unique-id";
import { useRouter } from "next/navigation";
import { Container } from "./lib/components/container/container";
import PrivateRoute from "./lib/components/private_route";
import { AIModel } from "./lib/chat-gpt/models/conversation";
import { Card } from "./lib/components/card/card";

const promptTemplates = [
  {
    text: "Química",
    model: AIModel.CHEMICAL,
    description: "Explora el mundo de la química.",
    icon: "🧪"
  },
  {
    text: "Arte",
    model: AIModel.ART,
    description: "Descubre tu creatividad a través del arte.",
    icon: "🎨"
  }
];

export default function Page() {
  const { newConvo } = useContext(AIContext);
  const router = useRouter();

  const onTemplateClicked = (template: AIModel) => {
    const uuid = new ShortUniqueId({ length: 6 }).randomUUID().toUpperCase();
    newConvo(uuid, template);
    router.push(`/chat/${uuid}`);
  };

  return (
    <PrivateRoute>
      <Container>
        <div className={styles["secondary-section"]}>
          <h2 className={styles["secondary-heading"]}>
            <b>Selecciona</b> un área de conocimiento
          </h2>
          <motion.div
            className={styles["prompts-container"]}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {promptTemplates.map((prompt, id) => (
              <div key={id} className="w-[230px]">
                <div className="bg-white p-4 rounded-tl-lg rounded-tr-lg">
                  <p className="mb-1">{prompt.icon}</p>
                  <p className="text-base font-bold">{prompt.text}</p>
                  <p className="text-sm">{prompt.description}</p>
                </div>
                <button
                  className="bg-[#5661F6] font-bold w-full p-3 rounded-bl-lg rounded-br-lg text-white text-sm"
                  onClick={() => onTemplateClicked(prompt.model)}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </PrivateRoute>
  );
}
