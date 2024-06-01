"use client";

import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { socket } from "../../socket";
import "./display.module.css";
import Image from "next/image";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState({
    text: "A la espera de contenido",
    image3d: "",
    component: "",
    cid: ""
  });
  const [viewMode, setViewMode] = useState("2D");

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("content-change", (data) => {
      setContent(data);
    });

    return () => {
      socket.off("content-change");
    };
  }, [id]);

  return (
    <div
      id="display-container"
      className="w-full h-full relative overflow-hidden"
    >
      <div className="bg-[#E42322] w-full h-[60px] relative z-20">
        <p className="text-white text-xl font-bold pl-4 py-4">Room {id}</p>
      </div>
      <div className="flex bg-black h-full">
        <div className="overflow-auto flex items-center justify-center text-white py-8 px-20">
          <div className="">
            <p className="text-[62px] font-bold text-start">
              {content.component}
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG`}
              ></a>
            </p>
            <p className="max-w-[70ch] text-justify">
              {content.text &&
                content.text.split("\n").map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </p>
          </div>
        </div>
        {content.cid && (
          <>
            <div className=" bg-white/20 h-full w-[1px]" />
            <div className="flex-1 relative">
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
                    className={`font-bold tab px-4 py-2 rounded-tr-[0px] rounded-br-[0px] ${
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
              <div className="flex-1 flex justify-center items-center h-full w-full bg-[#f5f5f5]">
                {viewMode === "2D" && (
                  <Image
                    src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG`}
                    alt="2D Image"
                    width={400}
                    height={400}
                    objectFit="contain"
                    // height={900}
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
