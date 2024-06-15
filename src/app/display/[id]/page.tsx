/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import "./display.module.css";
import { ArtContent, ChemicalContent } from "@/app/lib/chat-gpt/renderer";
import { AIModel } from "@/app/lib/chat-gpt/models/conversation";
import Head from "next/head";

interface Dimensions {
  width: number;
  height: number;
}

export default function Page() {
  const imageContainerRef = useRef<any>(null);
  const { id } = useParams<{ id: string }>();
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0
  });
  const [data, setData] = useState({
    model: null,
    content: null
  });

  const [viewMode, setViewMode] = useState("2D");

  useEffect(() => {
    if (data !== null) {
      setDimensions({
        width: imageContainerRef?.current?.clientWidth,
        height: imageContainerRef?.current?.clientHeight
      });
    }
  }, [data]);

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("content-change", (data) => {
      setData(data);
    });

    return () => {
      socket.off("content-change");
    };
  }, [id]);

  const showContent = () => {
    if (data.model === null) {
      return (
        <div className="bg-black h-full flex justify-center items-center">
          <p className="w-full text-3xl text-center text-white">
            {"A la espera de contenido"}
          </p>
        </div>
      );
    }

    return data.model === AIModel.CHEMICAL ? chemicalContent() : artContent();
  };

  const chemicalContent = () => {
    if (data === null || data.content === null) return;

    var chemicalContent = data.content as ChemicalContent;

    return (
      <div
        className={`${
          chemicalContent.answer !== null
            ? "flex flex-col-reverse xl:flex-row"
            : "h-full"
        } bg-black h-auto xl:h-full`}
      >
        <div
          className={`${
            chemicalContent.cid ? "[flex-basis:50%]" : ""
          } overflow-auto text-white `}
        >
          <div className="py-5 lg:py-20 px-10 lg:px-10">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-start mb-3 xl:mb-7 flex-1">
              {chemicalContent.component}
            </h1>
            {chemicalContent.answer.split("\n").map((line, i) => (
              <p
                key={i}
                className=" text-2xl md:text-4xl lg:text-5xl lg:[line-height:1.15] break-words"
              >
                {line}
                <br />
              </p>
            ))}
          </div>
        </div>
        <div className="xl:hidden bg-white/20 w-full h-[1px]" />
        {chemicalContent.cid && (
          <>
            <div className="hidden xl:block bg-white/20 h-full w-[1px]" />
            <div className="[flex-basis:50%] relative z-10">
              <div className="fixed flex justify-center items-center top-[100px] right-[40px]">
                <p className="text-[#989898] text-md mr-2">Ver como</p>
                <div className="flex border-2 border-[#989898] rounded-[8px]">
                  <button
                    className={`font-bold tab px-4 py-2 rounded-tl-[8px] rounded-bl-[8px] ${
                      viewMode === "2D"
                        ? "bg-[#ffdfdf] text-red-700"
                        : "bg-transparent text-[#989898]"
                    }`}
                    onClick={() => setViewMode("2D")}
                  >
                    2D
                  </button>
                  <div className=" bg-[#989898] h-ful w-[2px]" />
                  <button
                    className={`font-bold tab px-4 py-2 rounded-tr-[6px] rounded-br-[6px] ${
                      viewMode === "3D"
                        ? "bg-[#ffdfdf] text-red-700"
                        : "bg-transparent text-[#989898]"
                    }`}
                    onClick={() => setViewMode("3D")}
                  >
                    3D
                  </button>
                </div>
              </div>
              <div
                ref={imageContainerRef}
                className="flex justify-center z-0 items-center h-full  w-full bg-[#f5f5f5]"
              >
                {viewMode === "2D" && (
                  <img
                    src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${chemicalContent.cid}/PNG?image_size=${dimensions.width}x${dimensions.height}`}
                    className=""
                    alt="2D Image"
                  />
                )}
                {viewMode === "3D" && (
                  <iframe
                    src={`https://embed.molview.org/v1/?mode=balls&cid=${chemicalContent.cid}`}
                    title="Content Image 3D"
                    className="w-full h-full min-h-[500px]"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const artContent = () => {
    if (data.content === null) return;

    var artContent = data.content as ArtContent;

    return (
      <div
        className={`${
          artContent.answer !== null ? "flex flex-col-reverse xl:flex-row" : ""
        } bg-black h-auto xl:h-full`}
      >
        <div
          className={`${
            artContent.imageUrl ? "[flex-basis:50%]" : ""
          } overflow-auto text-white`}
        >
          <div className="py-5 lg:py-20 px-10 lg:px-10">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-start mb-3 xl:mb-7 flex-1">
              Descripción
            </h1>
            {artContent.answer.split("\n").map((line, i) => (
              <p
                key={i}
                className=" text-2xl md:text-4xl lg:text-5xl lg:[line-height:1.15] break-words"
              >
                {line}
                <br />
              </p>
            ))}
          </div>
        </div>
        <div className="xl:hidden bg-white/20 w-full h-[1px]" />
        {artContent.imageUrl && (
          <>
            <div className="hidden xl:block bg-white/20 h-full w-[1px]" />
            <div className="[flex-basis:50%] relative z-10">
              <div
                ref={imageContainerRef}
                className="flex justify-center z-0 items-center h-full w-full bg-[#f5f5f5]"
              >
                <img
                  src={artContent.imageUrl}
                  alt="Content Image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <Head>
        <title>Tu nuevo título aquí</title>
      </Head>
      <div
        id="display-container"
        className="w-full xl:h-full relative overflow-hidden"
      >
        <div className="bg-[#E42322] w-full h-[60px] relative z-20">
          <p className="text-white text-xl font-bold pl-4 py-4">Room {id}</p>
        </div>
        {showContent()}
      </div>
    </Fragment>
  );
}
