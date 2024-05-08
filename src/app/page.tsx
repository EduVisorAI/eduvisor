"use client";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import React from "react";
import { AIContext, AIContextProvider } from "./lib/contexts/ai-context";
import { Button } from "./lib/components/button/button";
import ShortUniqueId from "short-unique-id";
import { useRouter } from "next/navigation";
import { Container } from "./lib/components/container/container";
import PrivateRoute from "./lib/components/private_route";

export default function Page() {
  const router = useRouter();
  const aiContext = useContext(AIContext);

  const newChatHandler = () => {
    const uuid = new ShortUniqueId({ length: 6 }).randomUUID();
    aiContext.newConvo(uuid);
    router.push(`/chat/${uuid}`);
  };

  return (
    <PrivateRoute>
      <Container>
        <div className={styles["container"]}>
          <motion.div
            className={styles["hero-section"]}
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: 60, opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className={styles["hero-text"]}>
              <h1 className={styles["primary-heading"]}>
                EduVisor tu asistente educativo
              </h1>
              <p className={styles["subtitle"]}>
                ¡Tu asistente educativo siempre está aquí para ayudarte a hacer
                tu vida más fácil!
              </p>
            </div>
            <div className={styles["hero-btn-container"]}>
              <Button
                level="primary"
                fullWidth={false}
                clickHandler={newChatHandler}
              >
                Comenzar
              </Button>
              <div className="mx-1"></div>
              <Button
                level="secondary"
                fullWidth={false}
                clickHandler={() => {}}
              >
                Como funciona
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </PrivateRoute>
  );
}
