import { IFood } from "../interfaces/iFood.js";

export class Food {
  private _id: string;
  private _name: string;
  private _category: string;
  private _unit: string;

  constructor(data: IFood) {
    this._id = data.id;
    this._name = data.name;
    this._category = data.category;
    this._unit = data.unit;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get category() {
    return this._category;
  }

  get unit() {
    return this._unit;
  }
}
