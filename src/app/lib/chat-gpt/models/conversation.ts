import { Speech, Summary } from "../utils";

export enum AIModel {
  CHEMICAL = "QUIMICA",
  ART = "ARTE"
}

export class Conversation {
  private _id: string;
  private _title: string;
  private _description: string;
  private _model: AIModel;
  speeches: Speech[];

  constructor(
    model: AIModel,
    speeches?: Speech[],
    id?: string,
    title?: string,
    description?: string
  ) {
    if (speeches) {
      this.speeches = speeches;
    } else {
      this.speeches = [];
    }

    this._id = id ? id : "";
    this._title = title ? title : "";
    this._description = description ? description : "";
    this._model = model;
  }

  add(speech: Speech) {
    this.speeches.push(speech);
  }

  summarize(summary: Summary) {
    if (this.speeches.length >= 2) {
      this._title = summary.title;
      this._description = summary.description;
    }
  }

  model() {
    return this._model;
  }

  id() {
    return this._id;
  }

  title() {
    if (this._title.trim().length > 0) {
      return this._title;
    } else {
      return "Conversación sin título";
    }
  }

  description() {
    if (this._description.trim().length > 0) {
      return this._description;
    } else {
      return "This conversation hasn't been summarized.";
    }
  }
}
