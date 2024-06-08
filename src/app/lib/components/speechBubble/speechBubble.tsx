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
import Image from "next/image";

export const SpeechBubble: React.FC<{
  speaker: string;
  text: string;
  chatId?: string;
  component?: string;
  cid?: string;
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
      <p className="font-bold">{props.text}</p>
    );

    return (
      <div className="flex gap-2 items-center">
        <img src="/profile.png" className="block" />
        <div className={styles[speechBubbleClass]}>{content}</div>
      </div>
    );
  };

  const AIBubble = () => {
    const content = props.loading ? (
      <img src={Loader.src} width={40} alt="Loading" />
    ) : (
      <>
        <p className="font-medium text-[18px] mb-2">
          {props.text &&
            props.text.split("\n").map((line: string, i: any) => (
              <Fragment key={i}>
                {line}
                <br />
              </Fragment>
            ))}
        </p>

        {props.cid && (
          <div className="flex gap-4 my-2">
            <iframe
              style={{ width: "300px", height: "300px" }}
              src={`https://embed.molview.org/v1/?mode=balls&cid=${props.cid}`}
            ></iframe>
            <img
              src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${props.cid}/PNG?image_size=300x299`}
              alt="2D Image"
              style={{ border: "1px solid #000" }} // Agrega esta línea
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
                  text: props.text,
                  image3d: `https://embed.molview.org/v1/?mode=balls&cid=${props.cid}`,
                  component: props.component,
                  cid: props.cid
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
