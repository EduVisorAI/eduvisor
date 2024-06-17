import { AI } from "./models/ai";
import { AIModel, Conversation } from "./models/conversation";
import { Human } from "./models/human";
import { Prompt } from "./models/prompt";
import { Temperature } from "./models/temperature";
import { Token } from "./models/token";
import { Parser } from "./parser";
import { RenderedConversation, Renderer } from "./renderer";

export class Controller {
  newConvo(conversation: RenderedConversation) {
    const convos = this.readConversations();
    const parser = new Parser();
    const renderer = new Renderer();
    const newConvo = parser.conversation(conversation);
    convos.push(newConvo);
    this.writeConversations(convos);
    return renderer.conversation(newConvo);
  }

  async prompt(convoId: string, prompt: string, userId: string) {
    const convos = this.readConversations();
    const curConvo = convos.find((c) => c.id() === convoId) as Conversation;
    const human = new Human();
    const ai = this.readAI();
    const speech = human.speak({ answer: prompt });
    human.add(speech, curConvo);
    ai.prompt = new Prompt(prompt);
    const response = await ai.think(curConvo, userId);
    ai.add(response, curConvo);
    this.writeConversations(convos);
    return response;
  }

  async regenerate(convoId: string, userId: string) {
    const convos = this.readConversations();
		const curConvo = convos.find((c) => c.id() === convoId) as Conversation;
		const speeches = curConvo.speeches;

			const lastSpeechAI = speeches[speeches.length - 1];
		const lastSpeechHuman = speeches[speeches.length - 2];
		
		
			

    // const human = new Human();
    const ai = this.readAI();
    // const speech = human.speak({ answer: prompt });
    // human.add(speech, curConvo);
    // ai.prompt = new Prompt(prompt);
    const response = await ai.think(curConvo, userId);
    // ai.add(response, curConvo);
    // this.writeConversations(convos);
    return response;
  }

  async summarize(convoId: string) {
    const convos = this.readConversations();
    const curConvo = convos.find((c) => c.id() === convoId) as Conversation;
    const ai = this.readAI();
    await ai.summarize(curConvo);
    this.writeConversations(convos);
  }

  configure(temperature: number, token: number, prompt: string) {
    const parser = new Parser();
    const renderer = new Renderer();
    const ai = parser.ai({
      race: "AI",
      temperature: temperature,
      token: token,
      prompt: prompt
    });
    this.writeAI(ai);
    return {
      temperature: renderer.temperature(ai.temperature),
      token: renderer.token(ai.token),
      prompt: renderer.prompt(ai.prompt)
    };
  }

  convos() {
    const convos = this.readConversations();
    const renderer = new Renderer();
    return renderer.conversations(convos);
  }

  settings() {
    const ai = this.readAI();
    const renderer = new Renderer();
    return renderer.ai(ai);
  }

  private readConversations() {
    const JSONParsedConvos = JSON.parse(
      localStorage.getItem("conversations") as string
    );
    const parser = new Parser();
    const conversations: Conversation[] = [];
    if (JSONParsedConvos) {
      for (let i = 0; i < JSONParsedConvos.length; i++) {
        const renderedConvo = JSONParsedConvos[i];
        const convo = parser.conversation(renderedConvo);
        conversations.push(convo);
      }
    }
    return conversations;
  }

  private writeConversations(convos: Conversation[]) {
    const renderer = new Renderer();
    const conversations = renderer.conversations(convos);
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }

  private readAI() {
    const JSONParsedAI = JSON.parse(localStorage.getItem("AI") as string);
    const parser = new Parser();
    let ai: AI;
    if (JSONParsedAI) {
      ai = parser.ai(JSONParsedAI);
    } else {
      ai = new AI(new Temperature(0), new Token(2048), new Prompt());
    }
    return ai;
  }

  private writeAI(ai: AI) {
    const renderer = new Renderer();
    const renderedAI = renderer.ai(ai);
    localStorage.setItem("AI", JSON.stringify(renderedAI));
  }
}
