import { RecipePart } from "./recipePart";

export class Recipe {
  constructor(
    public id: string,
    public title: string,
    public cookTimeMinutes: number,
    public imageSource: string,
    public dietTags: string[],
    public mealTypeTags: string[],
    public servings: number,
    public parts: RecipePart[],
    public preparaTionTimeMinutes?: number,
  ) {}
}
