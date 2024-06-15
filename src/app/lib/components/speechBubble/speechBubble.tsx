/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import styles from "./speechBubble.module.css";
import Loader from "../../../../../public/loading.gif";
import { motion } from "framer-motion";
import { Button } from "../button/button";
import { MdiShowOutline } from "../../assets/show-outline";
import { SolarRefreshCircleLinear } from "../../assets/refresh-circle";
import { socket } from "../../../socket";
import { AIModel } from "../../chat-gpt/models/conversation";
import {
  ArtContent,
  ChemicalContent,
  RenderedSpeech
} from "../../chat-gpt/renderer";

export const SpeechBubble: React.FC<{
  chatId?: string;
  model?: AIModel;
  speaker?: string;
  speech: RenderedSpeech;
  loading?: boolean;
  animate: boolean;
  delay?: number;
}> = (props) => {
  let speechBubbleClass: string;
  let containerClass: string;

  if (props.speaker === "ai") {
    speechBubbleClass = "ai";
    containerClass = "ai-container";
  } else {
    speechBubbleClass = "user";
    containerClass = "user-container";
  }

  const UserBubble = () => {
    const content = props.loading ? (
      <img src={Loader.src} width={40} alt="Loading" />
    ) : (
      <p className="font-bold">{props.speech.content.answer}</p>
    );

    return (
      <div className="flex gap-2 items-center">
        <img src="/profile.png" className="block" />
        <div className={styles[speechBubbleClass]}>{content}</div>
      </div>
    );
  };

  const ChemicalContentComponent = ({ speech }: { speech: RenderedSpeech }) => {
    const content = speech.content as ChemicalContent;
    const socketContent = {
      answer: content.answer,
      component: content.component,
      cid: content.cid
    };

    return (
      <>
        <p className="font-medium text-[18px] mb-2">
          {content.answer &&
            content.answer.split("\n").map((line: string, i: any) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
        </p>

        {content.cid && (
          <div className="flex flex-col lg:flex-row gap-4 my-2">
            <iframe
              style={{ width: "300px", height: "300px" }}
              src={`https://embed.molview.org/v1/?mode=balls&cid=${content.cid}`}
            ></iframe>
            <div className="w-[300px] h-[299px]">
              <img
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG?image_size=300x299`}
                alt="2D Image"
                style={{ border: "1px solid #000" }} // Agrega esta línea
              />
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-2">
          <Button
            level="secondary"
            fullWidth={false}
            clickHandler={() => {
              socket.emit(
                "send-to-display",
                {
                  model: props.model,
                  content: socketContent
                },
                props.chatId
              );
            }}
          >
            <div className="flex gap-1 items-center">
              <MdiShowOutline />
              <p className="text-sm font-bold">Mostrar en display</p>
            </div>
          </Button>
          <Button level="secondary" fullWidth={false}>
            <div className="flex gap-1 items-center">
              <SolarRefreshCircleLinear />
              <p className="text-sm font-bold">Regenerar</p>
            </div>
          </Button>
        </div>
      </>
    );
  };

  const ArtContentComponent = ({ speech }: { speech: RenderedSpeech }) => {
    const content = speech.content as ArtContent;
    const socketContent = {
      answer: content.answer,
      imageUrl: content.imageUrl
    };

    return (
      <>
        <p className="font-medium text-[18px] mb-2">
          {content.answer &&
            content.answer.split("\n").map((line: string, i: any) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
        </p>

        {content.imageUrl && (
          <div className="w-[300px] h-[300px] my-2">
            <img
              src={`${content.imageUrl}`}
              alt="Art Image"
              className="object-contain object-left min-w-full w-full h-full"
            />
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button
            level="secondary"
            fullWidth={false}
            clickHandler={() => {
              socket.emit(
                "send-to-display",
                {
                  model: props.model,
                  content: socketContent
                },
                props.chatId
              );
            }}
          >
            <div className="flex gap-1 items-center">
              <MdiShowOutline />
              <p className="text-sm font-bold">Mostrar en display</p>
            </div>
          </Button>
          <Button level="secondary" fullWidth={false}>
            <div className="flex gap-1 items-center">
              <SolarRefreshCircleLinear />
              <p className="text-sm font-bold">Regenerar</p>
            </div>
          </Button>
        </div>
      </>
    );
  };

  const AIBubble = () => {
    const content = props.loading ? (
      <img src={Loader.src} width={40} alt="Loading" />
    ) : (
      <>
        {props.model === AIModel.CHEMICAL ? (
          <ChemicalContentComponent speech={props.speech} />
        ) : (
          <ArtContentComponent speech={props.speech} />
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

  if (props.animate) {
    return (
      <motion.div
        className={styles[containerClass]}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.5, delay: props.delay ? props.delay : 0 }}
      >
        {props.speaker === "user" ? <UserBubble /> : <AIBubble />}
      </motion.div>
    );
  } else {
    return (
      <div className={styles[containerClass]}>
        {props.speaker === "user" ? <UserBubble /> : <AIBubble />}
      </div>
    );
  }
};
