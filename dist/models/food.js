export class Food {
    constructor(data) {
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
