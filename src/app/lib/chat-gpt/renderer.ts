import { List } from "postcss/lib/list";
import { AI } from "./models/ai";
import { AIModel, Conversation } from "./models/conversation";
import { Prompt } from "./models/prompt";
import { Speaker } from "./models/speaker";
import { Temperature } from "./models/temperature";
import { Token } from "./models/token";
import { Speech } from "./utils";

export interface ChemicalContent {
  answer: string;
  component?: string;
  cid?: string;
}

export interface ArtContent {
  answer: string;
  title?: string;
  imageUrl?: string[];
  imageIndex?: number;
}

export type RenderedSpeech = {
  speaker: string;
  content: ChemicalContent | ArtContent;
};

export type RenderedConversation = {
  id: string;
  title: string;
  description: string;
  speeches: RenderedSpeech[];
  model: AIModel;
};

export class Renderer {
  conversations(convos: Conversation[]) {
    const conversations: RenderedConversation[] = [];
    for (let i = 0; i < convos.length; i++) {
      const renderedConvo = this.conversation(convos[i]);
      conversations.push(renderedConvo);
    }
    return conversations;
  }

  conversation(convo: Conversation) {
    const renderedConvosArr: RenderedSpeech[] = [];

    for (let i = 0; i < convo.speeches.length; i++) {
      const speech = this.speech(convo.speeches[i]);
      renderedConvosArr.push(speech);
    }
    return {
      id: convo.id(),
      title: convo.title(),
      description: convo.description(),
      model: convo.model(),
      speeches: renderedConvosArr
    };
  }

  speech(speech: Speech) {
    return {
      speaker: this.speaker(speech.speaker).race.valueOf(),
      content: speech.content
    };
  }

  speaker(speaker: Speaker) {
    return { race: speaker.race };
  }

  ai(ai: AI) {
    return {
      race: this.speaker(ai).race.valueOf(),
      temperature: this.temperature(ai.temperature),
      token: this.token(ai.token),
      prompt: this.prompt(ai.prompt)
    };
  }

  temperature(temp: Temperature) {
    return temp.value;
  }

  token(token: Token) {
    return token.length;
  }

  prompt(prompt: Prompt) {
    return prompt.content;
  }

  AIPrompt(sysPrompt: Prompt, convo: Conversation) {
    let prompt = sysPrompt.content;
    for (let i = 0; i < convo.speeches.length; i++) {
      const speech = `${this.speaker(
        convo.speeches[i].speaker
      ).race.valueOf()}: ${convo.speeches[i].content}`;
      prompt = `${prompt} ${speech}`;
    }
    return prompt;
  }
}
