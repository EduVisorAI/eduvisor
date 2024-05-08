"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState({
    text: "A la espera de contenido",
    image: ""
  });

  useEffect(() => {
    socket.on("content-change", (data) => {
      setContent(data);
    });

    return () => {
      socket.off("content-change");
    };
  }, []);

  return (
    <div className="h-full max-w-[56rem] flex flex-col justify-center items-center mx-auto text-center">
      <p className="text-red-500 font-bold text-5xl">Room {id}</p>
      {/* Display the content text */}
      <p className="text-xl">{content.text}</p>

      {/* Display the iframe */}
      {content.image && (
        <iframe
          src={content.image}
          title="Content Image"
          className="w-full h-64"
        />
      )}
    </div>
  );
}
