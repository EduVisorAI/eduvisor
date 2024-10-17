import styles from "./chatItem.module.css";
import { RenderedConversation } from "../../chat-gpt/renderer";
import { FaTrash } from "react-icons/fa"; // Importing the delete icon

export const ChatItem: React.FC<
  React.PropsWithChildren<{ convo: RenderedConversation; isActive: boolean, onDelete: (id: string) => void }>
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
        <h4 className={`${styles["title"]} mr-2`}>
          {format(props.convo.title, 20)}
        </h4>
        <button
          className={styles["delete-button"]}
          onClick={() => {
						// Update the UI by triggering a state change
						props.onDelete(props.convo.id);
            // Optionally, you can add additional logic here, such as updating the state or notifying the user
          }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};
