import { Speaker } from "./models/speaker";
import { ChemicalContent, ArtContent } from "./renderer";

export interface Speech {
  speaker: Speaker;
  content: ChemicalContent | ArtContent;
}

export interface Summary {
  title: string;
  description: string;
}
