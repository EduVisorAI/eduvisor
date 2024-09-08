import { ChemicalContent, RenderedSpeech } from "@/app/lib/chat-gpt/renderer";
import { useState, useRef } from "react";
import { MarkdownRenderer } from "../../markdownRenderer/markdownRenderer";
import { Button } from "../../button/button";
import { socket } from "@/app/socket";
import { MdiShowOutline } from "@/app/lib/assets/show-outline";
import { SolarRefreshCircleLinear } from "@/app/lib/assets/refresh-circle";

export const ChemicalAnswer = ({
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
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const content = speech.content as ChemicalContent;
  const socketContent = {
    answer: content.answer,
    component: content.component,
    cid: content.cid
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleViewModeChange = (mode: "2D" | "3D") => {
    if (viewMode !== mode) {
      setViewMode(mode);
      socket.emit(
        "update-display",
        { model: "QUIMICA", viewMode: mode },
        chatId
      );
    }
  };

  const handleSendToDisplay = () => {
    socket.emit(
      "send-to-display",
      { model: "QUIMICA", content: socketContent, viewMode },
      chatId
    );
  };

  return (
    <>
      <p className="font-medium text-[18px] mb-2">
        {content.answer && <MarkdownRenderer markdown={content.answer} />}
      </p>

      {content.cid && (
        <div className="flex flex-col gap-4 my-2">
          <div className="flex justify-start gap-2">
            <Button
              fullWidth={false}
              level="secondary"
              clickHandler={() => handleViewModeChange("2D")}
            >
              2D
            </Button>

            <Button
              fullWidth={false}
              level="secondary"
              clickHandler={() => handleViewModeChange("3D")}
            >
              3D
            </Button>
          </div>

          {viewMode === "3D" ? (
            <iframe
              ref={iframeRef}
              style={{ width: "300px", height: "300px" }}
              src={`https://embed.molview.org/v1/?mode=balls&cid=${content.cid}`}
              sandbox="allow-scripts allow-same-origin allow-popups"
            ></iframe>
          ) : (
            <div className="w-[300px] h-[299px]">
              <img
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${content.cid}/PNG?image_size=300x299`}
                alt="2D Image"
                style={{ border: "1px solid #000" }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "/broken_image.jpg";
                  currentTarget.style.width = "300px";
                  currentTarget.style.height = "299px";
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-2">
        <Button
          level="secondary"
          fullWidth={false}
          clickHandler={handleSendToDisplay}
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
            clickHandler={() => handleRegeneratePrompt(chatId)}
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
