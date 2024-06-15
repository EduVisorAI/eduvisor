/* eslint-disable react-hooks/exhaustive-deps */
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { useContext, useEffect, useState } from "react";
import { ChatItem } from "../chatItem/chatItem";
import { AIContext } from "../../contexts/ai-context";
import styles from "../button/button.module.css";
import Drawer from "../drawer/drawer";
import { IcBaselinePlus } from "../../assets/add";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import ShortUniqueId from "short-unique-id";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../button/button";
import { RenderedConversation } from "../../chat-gpt/renderer";

export const Navigation = () => {
  const [, setChatTitle] = useState("");
  const [conversation, setConversation] = useState<
    RenderedConversation | undefined
  >();
  const { chatId } = useParams<{ chatId: string }>();
  const { conversations } = useContext(AIContext);
  const router = useRouter();

  useEffect(() => {
    const convoFound = getConversation() as RenderedConversation | undefined;

    if (convoFound) {
      setConversation(conversations.find((c) => c.id === chatId));
      setChatTitle(convoFound.title);
    } else {
      setChatTitle("");
    }
  }, [chatId, conversations]);

  const getConversation = () => {
    return conversations.find((c) => c.id === chatId) && chatId;
  };

  const newChatHandler = () => {
    const uuid = new ShortUniqueId({ length: 6 }).randomUUID().toUpperCase();
    router.push(`/chat/${uuid}`);
  };

  const SettingsButton = () => {
    return (
      <Menu
        menuButton={
          <div
            className={`flex items-center rounded-full my-2 justify-start gap-2 border-[#EFEFEF] hover:bg-gray-200 transition-all duration-300 cursor-pointer border-[1px] p-4`}
          >
            <div className="bg-[#EFEFEF] rounded-full p-[4px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-[20px] h-[20px] block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="font-bold text-[14px]">Configuración</p>
          </div>
        }
      >
        <MenuItem>
          <button
            className="font-bold text-[14px]"
            onClick={() => {
              signOut(auth).then(() => {
                localStorage.clear();
                window.location.reload();
              });
            }}
          >
            Cerrar Sesión
          </button>
        </MenuItem>
      </Menu>
    );
  };

  const ProfileButton = () => {
    return (
      <div
        className={`flex items-center rounded-full my-2  justify-start gap-2 border-[#EFEFEF] border-[1px] p-4`}
      >
        <img src="/profile.png" className="w-[28px] h-[28px]" />
        <p className="font-bold text-[14px]">Alfredo Barrientos</p>
      </div>
    );
  };

  const MobileSidebar = () => {
    const [openLeft, setOpenLeft] = useState(false);
    return (
      <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-200">
        <div onClick={() => setOpenLeft(!openLeft)}>
          <img src="/menu.png" className="cursor-pointer" />
          <Drawer open={openLeft} side="left" setOpen={setOpenLeft}>
            <Sidebar />
          </Drawer>
        </div>
        {chatId && (
          <div className="flex gap-2 md:hidden justify-end">
            <button
              className={`${styles["btn"]} ${styles["primary"]} m-0`}
              onClick={() => {
                window.open(`/display/${chatId}`, "_blank");
              }}
            >
              Room {chatId}
            </button>
            <Button level="secondary" fullWidth={false} submitting>
              {conversation !== null ? conversation?.model : ""}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const Sidebar = () => {
    return (
      <div className="w-[280px] flex flex-col overflow-x-hidden shrink-0 bg-white h-full">
        <div className="h-full w-[280px] px-5 py-3">
          <div className="flex-1 w-full h-full relative">
            <nav className="flex h-full min-h-0 flex-col">
              <div className="left-0 right-0 top-0 z-20">
                <div className="mb-5">
                  <img src={"/logo.png"} />
                </div>
                <div className="flex justify-center items-center gap-2 mb-5">
                  <button
                    onClick={newChatHandler}
                    className={`${styles["btn"]} bg-[#5661F6] hover:bg-[#4C53D7] gap-2 rounded-full items-center text-white py-3 flex-1 m-0`}
                  >
                    <IcBaselinePlus />
                    <p>Nuevo chat</p>
                  </button>
                  <button className="rounded-full bg-black p-3 flex justify-center items-center">
                    <img src={"/search.png"} />
                  </button>
                </div>
                <div className="my-0 flex justify-between border-t border-b border-gray-200/50 py-4">
                  <p className="text-[#6A6969] font-bold text-[12px]">
                    Tus conversaciones
                  </p>
                  <button
                    className="text-[#5661F6] font-bold text-[12px]"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Limpiar todo
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto h-full ml-1">
                {conversations.map((convo, index) => (
                  <Link key={index} href={`/chat/${convo.id}`}>
                    <ChatItem convo={convo} isActive={chatId === convo.id} />
                  </Link>
                ))}
              </div>
              <SettingsButton />
              <ProfileButton />
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden block">
        <MobileSidebar />
      </div>
    </>
  );
};
