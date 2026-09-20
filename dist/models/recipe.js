export class Recipe {
    constructor(data) {
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
