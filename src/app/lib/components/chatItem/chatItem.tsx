import styles from "./chatItem.module.css";
import { RenderedConversation } from "../../chat-gpt/renderer";

export const ChatItem: React.FC<
  React.PropsWithChildren<{ convo: RenderedConversation; isActive: boolean }>
> = (props) => {
  const format = (text: string, length: number) => {
    const shouldBeTruncated = text.length >= length;
    if (shouldBeTruncated) {
      return `${text.substring(0, length)}...`;
    } else {
      return text;
    }
  };

  return (
    <div
      className={` ${styles["card"]} ${props.isActive ? styles["active"] : ""}`}
    >
      <div className={`flex gap-2`}>
        <img
          src={`/message${props.isActive ? "_active" : ""}.png`}
          className={`object-contain ${props.isActive ? "#5661F6" : ""} `}
        />
        <h4 className={styles["title"]}>{format(props.convo.title, 23)}</h4>
      </div>
    </div>
  );
};
