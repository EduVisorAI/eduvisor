/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import "./display.module.css";

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
  const [content, setContent] = useState({
    text: null,
    image3d: "",
    component: "",
    cid: ""
  });
  const [viewMode, setViewMode] = useState("2D");

  useEffect(() => {
    if (content.cid === null) return;
    setDimensions({
      width: imageContainerRef?.current?.clientWidth,
      height: imageContainerRef?.current?.clientHeight
    });
  }, [content.cid]);

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("content-change", (data) => {
      setContent(data);
    });

    return () => {
      socket.off("content-change");
    };
  }, [id]);

  const showContent = () => {
    if (content.text === null) {
      return (
        <div className="h-full flex justify-center items-center">
          <p className="w-full text-3xl text-center text-white">
            {"A la espera de contenido"}
          </p>
        </div>
      );
    }

    var text = content.text as String;

    return (
      <div
        className={`${
          content.cid ? "[flex-basis:50%]" : ""
        } overflow-auto flex items-center justify-center text-white `}
      >
        <div className="flex flex-col pt-[10rem] pb-[6rem] px-20">
          <h1 className="text-8xl font-bold text-start flex-1">
            {content.component}
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG`}
            ></a>
          </h1>
          {text.split("\n").map((line, i) => (
            <p
              key={i}
              className="max-w-[70ch] text-xl md:text-2xl lg:text-3xl text-justify flex-1"
            >
              {line}
              <br />
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      id="display-container"
      className="w-full h-full relative overflow-hidden"
    >
      <div className="bg-[#E42322] w-full h-[60px] relative z-20">
        <p className="text-white text-xl font-bold pl-4 py-4">Room {id}</p>
      </div>
      <div className={`${content.text !== null ? "flex" : ""} bg-black h-full`}>
        {showContent()}
        {content.cid && (
          <>
            <div className=" bg-white/20 h-full w-[1px]" />
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
                className="flex justify-center z-0 items-center h-full w-full bg-[#f5f5f5]"
              >
                {viewMode === "2D" && (
                  <img
                    src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG?image_size=${dimensions.width}x${dimensions.height}`}
                    className=""
                    alt="2D Image"
                  />
                )}
                {content.image3d && viewMode === "3D" && (
                  <iframe
                    src={content.image3d}
                    title="Content Image 3D"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
