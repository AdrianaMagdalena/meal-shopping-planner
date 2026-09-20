import { IRecipe, IRecipePart } from "../interfaces/iRecipe.js";

export class Recipe implements IRecipe {
  private _id: string;
  private _title: string;
  private _preparaTionTime?: number;
  private _cookTime: number;
  private _image: string;
  private _dietTags: string[];
  private _mealTypeTags: string[];
  private _servings: number;
  private _parts: IRecipePart[];

  constructor(data: IRecipe) {
    this._id = data.id;
    this._title = data.title;
    this._preparaTionTime = data.preparationTime;
    this._cookTime = data.cookTime;
    this._image = data.image;
    this._dietTags = data.dietTags;
    this._mealTypeTags = data.mealTypeTags;
    this._servings = data.servings;
    this._parts = data.parts;
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get preparationTime() {
    return this._preparaTionTime;
  }
  get cookTime() {
    return this._cookTime;
  }
  get image() {
    return this._image;
  }
  get dietTags() {
    return this._dietTags;
  }
  get mealTypeTags() {
    return this._mealTypeTags;
  }
  get servings() {
    return this._servings;
  }
  get parts() {
    return this._parts;
  }
}
