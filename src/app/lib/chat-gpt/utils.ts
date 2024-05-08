import { Speaker } from "./models/speaker";

export interface Speech {
  speaker: Speaker;
  content: {
    response: string;
    cid?: string;
  };
}

export interface Summary {
  title: string;
  description: string;
}
