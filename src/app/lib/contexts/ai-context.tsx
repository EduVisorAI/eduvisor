"use client";

import React, { useEffect, useState } from "react";
import { RenderedConversation } from "../chat-gpt/renderer";
import { Controller } from "../chat-gpt/controller";

export const AIContext = React.createContext<{
  conversations: RenderedConversation[];
  temperature: number;
  token: number;
  prompt: string;
  newConvo: (uuid: string) => void;
  sendPrompt: (id: string, prompt: string, userId: string) => Promise<void>;
  configure: (temp: number, token: number, prompt: string) => void;
}>({
  conversations: [],
  temperature: 0,
  token: 2048,
  prompt: "",
  newConvo: (_uuid: string) => {},
  sendPrompt: (_id: string, _prompt: string, _userId: string) =>
    new Promise((_resolve, _reject) => {}),
  configure: (_temp: number, _token: number, _prompt: string) => {}
});

export const AIContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [conversations, setConversations] = useState<RenderedConversation[]>(
    []
  );
  const [temperature, setTemperature] = useState(0);
  const [token, setToken] = useState(2048);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const chatGptApi = new Controller();
    const convos = chatGptApi.convos();
    const ai = chatGptApi.settings();
    setConversations(convos);
    setTemperature(ai.temperature);
    setToken(ai.token);
    setPrompt(ai.prompt);
  }, []);

  const newConvo = async (uuid: string) => {
    const chatGptApi = new Controller();
    const addedConvo = chatGptApi.newConvo({
      id: uuid,
      title: "",
      description: "",
      speeches: []
    });
    setConversations((prevConvos) => [...prevConvos, addedConvo]);
  };

  const sendPrompt = async (id: string, prompt: string, userId: string) => {
    const chatGptApi = new Controller();
    setConversations((prevConvos) => {
      const newConvos = [...prevConvos];
      newConvos
        .find((c) => c.id === id)!
        .speeches.push({
          speaker: "HUMAN",
          content: {
            response: prompt
          }
        });
      return newConvos;
    });

    await chatGptApi.prompt(id, prompt, userId);
    const conversations = chatGptApi.convos();
    setConversations(conversations);
    summarizeConvo(id);
  };

  const summarizeConvo = async (id: string) => {
    const chatGptApi = new Controller();
    let conversations = chatGptApi.convos();
    const convo = conversations.find((c) => c.id === id);
    if (
      convo?.speeches.length === 2 ||
      convo?.title === "Untitled Conversation" ||
      convo?.description === "This conversation hasn't been summarized."
    ) {
      await chatGptApi.summarize(id);
      conversations = chatGptApi.convos();
      setConversations(conversations);
    }
  };

  const configure = (temp: number, token: number, prompt: string) => {
    const chatGptApi = new Controller();
    const settings = chatGptApi.configure(temp, token, prompt);
    setTemperature(settings.temperature);
    setToken(settings.token);
    setPrompt(settings.prompt);
  };

  return (
    <AIContext.Provider
      value={{
        conversations: conversations,
        temperature: temperature,
        token: token,
        prompt: prompt,
        newConvo: newConvo,
        sendPrompt: sendPrompt,
        configure: configure
      }}
    >
      {props.children}
    </AIContext.Provider>
  );
};
