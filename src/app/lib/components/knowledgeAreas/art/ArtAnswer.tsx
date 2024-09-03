import { ArtContent, RenderedSpeech } from "@/app/lib/chat-gpt/renderer";
import { useState, useCallback, useMemo } from "react";
import { MarkdownRenderer } from "../../markdownRenderer/markdownRenderer";
import SimpleImageSlider from "react-simple-image-slider";
import { socket } from "@/app/socket";
import { Button } from "../../button/button";
import { MdiShowOutline } from "@/app/lib/assets/show-outline";
import { SolarRefreshCircleLinear } from "@/app/lib/assets/refresh-circle";

interface ArtAnswerProps {
  speech: RenderedSpeech;
  chatId: string;
  canRegenerate: boolean;
  handleRegeneratePrompt: (chatId: string) => void;
}

export const ArtAnswer: React.FC<ArtAnswerProps> = ({
  speech,
  chatId,
  canRegenerate,
  handleRegeneratePrompt
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const content = speech.content as ArtContent;
  const { title, answer, imageUrl } = content;

  const socketContent = useMemo(
    () => ({
      title,
      answer,
      imageUrl
    }),
    [title, answer, imageUrl]
  );

  const handleNavClick = useCallback(
    (toRight: boolean) => {
      if (!imageUrl) return;
      const newIndex =
        (currentIndex + (toRight ? 1 : -1) + imageUrl.length) % imageUrl.length;

      socket.emit(
        "update-display",
        { model: "ARTE", imageIndex: newIndex },
        chatId
      );
      setCurrentIndex(newIndex);
    },
    [currentIndex, imageUrl, chatId]
  );

  const handleShowOnDisplay = useCallback(() => {
    socket.emit(
      "send-to-display",
      {
        model: "ARTE",
        content: socketContent,
        imageIndex: currentIndex
      },
      chatId
    );
  }, [socketContent, currentIndex, chatId]);

  const handleRegenerate = useCallback(() => {
    handleRegeneratePrompt(chatId);
  }, [handleRegeneratePrompt, chatId]);

  return (
    <>
      <p className="font-medium text-[18px] mb-2">
        {answer && <MarkdownRenderer markdown={answer} />}
      </p>

      {imageUrl && Array.isArray(imageUrl) && (
        <div className="relative">
          <SimpleImageSlider
            width={300}
            height={300}
            images={imageUrl}
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
          clickHandler={handleShowOnDisplay}
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
            clickHandler={handleRegenerate}
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
