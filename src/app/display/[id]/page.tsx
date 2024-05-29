"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import "./display.module.css";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState({
    name: "ETANOL",
    text: "A la espera de contenido",
    image: ""
  });

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("content-change", (data) => {
      setContent({
        name: content.name,
        text: data.text,
        image: data.image
      });
    });

    return () => {
      socket.off("content-change");
    };
  }, [id]);

  return (
    <div id="display-container" className="w-full h-screen">
      <div className="bg-[#E42322]">
        <p className="text-white text-xl font-bold pl-4 py-4">Room {id}</p>
      </div>
      <div className="h-full flex bg-black">
        <div className="flex-1 flex flex-col justify-center items-start text-white pl-20 w-full">
          <p className="text-4xl font-bold text-start">{content.name}</p>
          <div className="flex justify-center mt-2">
            <p className="text-xl max-w-[32ch] text-justify">{content.text}</p>
          </div>
        </div>
        <div className=" bg-white/20 h-full w-[1px]" />
        <div className="flex-1 bg-white">
          {content.image && (
            <iframe
              src={content.image}
              title="Content Image"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
