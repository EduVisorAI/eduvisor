/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { ArtContent, ChemicalContent } from "@/app/lib/chat-gpt/renderer";
import { AIModel } from "@/app/lib/chat-gpt/models/conversation";
import { MarkdownRenderer } from "@/app/lib/components/markdownRenderer/markdownRenderer";
import { zisouSlabs } from "@/app/lib/assets/fonts";

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

  const DisplayedContent = ({ data }: any) => {
    switch (data.model!) {
      case AIModel.CHEMICAL:
        return <ChemicalContent data={data} />;
      case AIModel.ART:
        return <ArtContent data={data} />;
      default:
        return <div className="bg-[#252525] h-full" />;
    }
  };

  const ChemicalContent = ({ data }: any) => {
    const [viewMode, setViewMode] = useState(data.viewMode ?? "2D");

    useEffect(() => {
      socket.on("content-update", setViewMode);

      return () => {
        socket.off("content-update");
      };
    }, []);

    if (!data?.content) return null;

    const { answer = "", component = "", cid } = data.content as ChemicalContent;

    return (
      <div className="bg-[#252525] h-full flex flex-col-reverse xl:flex-row">
        {answer && (
          <section className="[flex-basis:50%] overflow-auto text-white relative">
            <div className="absolute top-0 right-0 w-80 h-60 bg-[#3b3b3b] rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="py-5 lg:py-20 px-10 lg:px-10 relative z-0">
              <div className="absolute bottom-0 left-0 w-[30rem] h-[25rem] bg-[#3b3b3b] rounded-full transform -translate-x-1/2 translate-y-[10%]"></div>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-start mb-3 xl:mb-7 flex-1 z-10 relative">
                {component}
              </h1>
              <p className="text-2xl md:text-4xl lg:text-5xl lg:[line-height:1.15] font-normal break-words z-10 relative">
                <MarkdownRenderer markdown={answer} />
              </p>
            </div>
          </section>
        )}
        <div className="bg-white/20 w-full h-[1px] xl:hidden xl:w-[1px] xl:h-full" />
        <section className="[flex-basis:50%] relative z-10">
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
            {viewMode === "2D" ? (
              <img
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=${dimensions.width}x${dimensions.height}`}
                alt="2D Image"
                onError={({ currentTarget }: any) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "/broken_image.jpg";
                  currentTarget.style.width = dimensions.width + "px";
                  currentTarget.style.height = dimensions.height + "px";
                }}
              />
            ) : (
              <iframe
                src={`https://embed.molview.org/v1/?mode=balls&cid=${cid}`}
                title="Content Image 3D"
                className="w-full h-full min-h-[500px]"
              />
            )}
          </div>
        </section>
      </div>
    );
  };

  const ArtContent = ({ data }: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(
      data.content.imageIndex ?? 0
    );

    useEffect(() => {
      socket.on("content-update", setCurrentImageIndex);

      return () => {
        socket.off("content-update");
      };
    }, []);

    if (!data?.content) return null;

    const { title = "", answer = "", imageUrl = [] } = data.content as ArtContent;

    const handleNextImage = () => {
      setCurrentImageIndex((prevIndex: number) => (prevIndex + 1) % imageUrl.length);
    };

    const handlePreviousImage = () => {
      setCurrentImageIndex((prevIndex: number) => (prevIndex - 1 + imageUrl.length) % imageUrl.length);
    };

    return (
      <div className="bg-[#252525] h-full flex flex-col-reverse xl:flex-row">
        {answer && (
          <section className="[flex-basis:50%] overflow-auto text-white relative">
            <div className="absolute top-0 right-0 w-80 h-60 bg-[#3b3b3b] rounded-full transform translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="py-5 lg:py-20 px-10 lg:px-10 relative z-0">
              <div className="absolute bottom-0 left-0 w-[30rem] h-[25rem] bg-[#3b3b3b] rounded-full transform -translate-x-1/2 translate-y-[10%]"></div>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-start mb-3 xl:mb-7 flex-1 z-10 relative">
                {title}
              </h1>
              <p className="text-2xl md:text-4xl lg:text-5xl lg:[line-height:1.15] font-normal break-words z-10 relative">
                <MarkdownRenderer markdown={answer} />
              </p>
            </div>
          </section>
        )}
        <div className="bg-[white/20] w-full h-[1px] xl:hidden xl:w-[1px] xl:h-full" />
        {imageUrl.length > 0 && (
          <section className="[flex-basis:50%] relative z-10">
            <div className="fixed flex justify-center items-center top-[100px] right-[40px]">
              <div className="flex border-1 border-[#989898] rounded-[8px]">
                <button
                  className="font-bold text-xl tab px-4 py-2 rounded-l-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                  onClick={handlePreviousImage}
                >
                  {"<"}
                </button>
                <div className="bg-gray-400 h-full w-[1px]" />
                <button
                  className="font-bold text-xl tab px-4 py-2 rounded-r-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                  onClick={handleNextImage}
                >
                  {">"}
                </button>
              </div>
            </div>
            <div
              ref={imageContainerRef}
              className="flex justify-center z-0 items-center h-full w-full bg[#252525]"
            >
              <img
                src={imageUrl[currentImageIndex]}
                alt="Content Image"
                className="w-full h-full object-contain"
                onError={({ currentTarget }: any) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "../../../../public/broken_image.jpg";
                  currentTarget.style.width = dimensions.width + "px";
                  currentTarget.style.height = dimensions.height + "px";
                }}
              />
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div
      id="display-container"
      className={`w-full xl:h-full relative overflow-hidden ${zisouSlabs.className}`}
    >
      <div className="bg-[#E42322] w-full h-[60px] relative z-20">
        <p className="text-white text-xl font-normal pl-4 py-4">Room {id}</p>
      </div>
      <DisplayedContent data={data} />
    </div>
  );
}
