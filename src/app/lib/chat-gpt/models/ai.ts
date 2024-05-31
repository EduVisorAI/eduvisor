import { Conversation } from "./conversation";
import { Prompt } from "./prompt";
import { Race, Speaker } from "./speaker";
import { Temperature } from "./temperature";
import { Token } from "./token";
// import { Configuration, OpenAIApi } from "openai";

export class AI extends Speaker {
  temperature: Temperature;
  token: Token;
  prompt: Prompt;

  constructor(temp: Temperature, token: Token, prompt: Prompt) {
    super(Race.AI);
    this.temperature = temp;
    this.token = token;
    this.prompt = prompt;
  }

  configure(temperature: Temperature, token: Token, prompt: Prompt) {
    this.temperature = this.temperature.update(temperature);
    this.token = this.token.update(token);
    this.prompt = this.prompt.update(prompt);
  }

  async think(conversation: Conversation, userId: string) {
    const response = await this.request(this.prompt, conversation.id(), userId);

    return response;
  }

  async summarize(conversation: Conversation) {
    // const titlePrompt = new Prompt(
    //   "Summarize the following conversation with a title that doesn't exceed 20 letters."
    // );
    // const descriptionPrompt = new Prompt(
    //   "Read the following conversation, and based on the topic, predict what will be talked about. Then, write a short paragraph that summarizes the conversation."
    // );
    // const title = await this.request(titlePrompt);
    // const description = await this.request(descriptionPrompt);
    // conversation.summarize({
    //   title: title.content.response,
    //   description: description.content.response
    // });
    conversation.summarize({
      title: conversation.speeches[0].content.answer,
      description: conversation.speeches[0].content.answer
    });
  }

  private async request(prompt: Prompt, chatId: string, userId: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        message: prompt.content,
        userId: userId,
        chatId: chatId
      });

      //  {"response": "string", "cid": "number"}
      const res = await fetch(
        "https://eduvisor-backend.azurewebsites.net/api/chemical",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        }
      );

      const json = await res.json();
      return this.speak(json);
    } catch (error) {
      throw new Error("There was an error. Please try again.");
    }
  }
}
