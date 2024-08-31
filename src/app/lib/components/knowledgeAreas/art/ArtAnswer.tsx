import { ArtContent, RenderedSpeech } from "@/app/lib/chat-gpt/renderer";
import { useState } from "react";
import { MarkdownRenderer } from "../../markdownRenderer/markdownRenderer";
import SimpleImageSlider from "react-simple-image-slider";
import { socket } from "@/app/socket";
import { Button } from "../../button/button";
import { MdiShowOutline } from "@/app/lib/assets/show-outline";
import { SolarRefreshCircleLinear } from "@/app/lib/assets/refresh-circle";

export const ArtAnswer = ({
  speech,
  chatId,
  canRegenerate,
  handleRegeneratePrompt
}: {
  speech: RenderedSpeech;
  chatId: string;
  canRegenerate: boolean;
  handleRegeneratePrompt: (chatId: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const content = speech.content as ArtContent;
  const socketContent = {
    title: content.title,
    answer: content.answer,
    imageUrl: content.imageUrl
  };

  const handleNavClick = (toRight: boolean) => {
    setCurrentIndex((prevIndex) => (toRight ? prevIndex + 1 : prevIndex - 1));

    socket.emit(
      "update-display",
      {
        model: "ARTE",
        imageIndex: toRight ? currentIndex + 1 : currentIndex - 1
      },
      chatId
    );
  };

  return (
    <>
      <p className="font-medium text-[18px] mb-2">
        {content.answer && MarkdownRenderer({ markdown: content.answer })}
      </p>

      {content.imageUrl && Array.isArray(content.imageUrl) && (
        <div className="relative">
          <SimpleImageSlider
            width={300}
            height={300}
            images={content.imageUrl}
            showBullets={true}
            showNavs={true}
            onClickNav={handleNavClick}
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
                model: "ARTE",
                content: socketContent,
                imageIndex: currentIndex
              },
              chatId
            );
          }}
        >
          <div className="flex gap-1 items-center">
            <MdiShowOutline />
            <p className="text-sm font-bold">Mostrar en display</p>
          </div>
        </Button>
        {canRegenerate && (
          <Button
            level="secondary"
            fullWidth={false}
            clickHandler={() => handleRegeneratePrompt!(chatId!)}
          >
            <div className="flex gap-1 items-center">
              <SolarRefreshCircleLinear />
              <p className="text-sm font-bold">Regenerar</p>
            </div>
          </Button>
        )}
      </div>
    </>
  );
};
