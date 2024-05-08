import { Speech, Summary } from "../utils";

export class Conversation {
  private _id: string;
  private _title: string;
  private _description: string;
  speeches: Speech[];

  constructor(
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

  id() {
    return this._id;
  }

  title() {
    if (this._title.trim().length > 0) {
      return this._title;
    } else {
      return "Untitled Conversation";
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
