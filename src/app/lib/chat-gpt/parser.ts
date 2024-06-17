import { AI } from "./models/ai";
import { AIModel, Conversation } from "./models/conversation";
import { Prompt } from "./models/prompt";
import { Race, Speaker } from "./models/speaker";
import { Temperature } from "./models/temperature";
import { Token } from "./models/token";
import { ArtContent, ChemicalContent, RenderedConversation } from "./renderer";
import { Speech } from "./utils";

export class Parser {
  conversation(convo: RenderedConversation) {
    const speeches: Speech[] = [];
    for (let i = 0; i < convo.speeches.length; i++) {
      let speaker: Speaker;
      if (convo.speeches[i].speaker === "HUMAN") {
        speaker = new Speaker(Race.HUMAN);
      } else {
        speaker = new Speaker(Race.AI);
      }

      var content: ChemicalContent | ArtContent;

      if (convo.model === AIModel.CHEMICAL) {
        var c = convo.speeches[i].content as ChemicalContent;
        content = {
          answer: c.answer,
          cid: c.cid,
          component: c.component
        };

        speeches.push({
          speaker: speaker,
          content
        });
      } else if (convo.model === AIModel.ART) {
        var a = convo.speeches[i].content as ArtContent;
				content = {
					title: a.title,
          answer: a.answer,
          imageUrl: a.imageUrl
        };

        speeches.push({
          speaker: speaker,
          content
        });
      }
    }
    return new Conversation(
      convo.model,
      speeches,
      convo.id,
      convo.title,
      convo.description
    );
  }

  speech(speech: { speaker: Race; content: string }) {
    return {
      speaker: this.speaker(speech.speaker),
      content: speech.content
    };
  }

  speaker(race: Race) {
    return new Speaker(race);
  }

  ai(ai: { race: string; temperature: number; token: number; prompt: string }) {
    const temperature = this.temperature(ai.temperature);
    const token = this.token(ai.token);
    const prompt = this.prompt(ai.prompt);
    return new AI(temperature, token, prompt);
  }

  temperature(value: number) {
    return new Temperature(value);
  }

  token(length: number) {
    return new Token(length);
  }

  prompt(content: string) {
    return new Prompt(content);
  }
}
