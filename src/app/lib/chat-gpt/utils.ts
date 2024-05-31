import { Speaker } from "./models/speaker";

export interface Speech {
  speaker: Speaker;
  content: {
    answer: string;
    component?: string;
    cid?: string;
  };
}

export interface Summary {
  title: string;
  description: string;
}
