# Weekly Meal and Shopping Planner

Live URL: https://adrianamagdalena.github.io/meal-shopping-planner/

## Application structure and operation:

**NavigationComponent:**
HomePage – Recipe search – Planner – Weekly lists - Favorites

**Home page:**

- Information about how to use the app

**Recipe search:**

- Can be navigated to from the nav bar
- All recipes are listed upon arrival
- Recipe card:

  Recipe data: name, cooking & prep time, categories: diet (ex: vegetarian, vegan, gluten-free, lactose-free), meal type (ex: breakfast, lunch, dinner, snack),

  "Add to favorites" button,

  "Add to plan" button,

- Search field searches by keywords in the recipe title
- Additional filters for diet and meal type in dropdown menu
- Clicking a recipe card displays the full recipe
- Marking as favorite saves the dish to a separate favorites list
- "Add to plan" starts the weekly plan building process

**Recipe page**

- Photo, ingredients, description of recipe steps
- "Add to favorites" button – saves the dish to a separate favorites list
- "Add to plan" button – starts the weekly plan building process
- "Adjust serving size" button – allows selecting different amount of servings before adding to the weekly list, ingredient amount changes automatically
- If the recipe is added from the search page:

  A popup appears where you can specify how many servings and which day to add the dish to,

  If a serving size was already set on the recipe page, the same number automatically appears in the popup, where it can still be modified.

**Favorites list**

- Accessible from the nav bar
- Stores favorited recipes in alphabetical order
- Recipe cards are minimal – recipe name + "Add to weekly list" button
- If the recipe is added from the favorites page:

  A popup appears where you can specify how many servings and which day to add the dish to

- Clicking a recipe card displays the recipe

**Planner**

- Accessible from the nav bar
- The list can be built for up to 7 days
- Multiple recipes and multiple servings can be added to each day
- If the recipe is added from search or favorites:

  A popup appears where you can specify how many servings and which day to add the dish to,

  If a serving size was already set on the recipe page, the same number automatically appears in the popup, where it can still be modified.

- Each entry on each day's block allows adjusting the serving count
- All the entries can be removed at the same time to start fresh
- "Generate weeklt list" button – confirms the weekly list; the shopping list and recipe list is generated at this point

**Week's lists**

- Recipes in the weekly menu are placed without duplication into a collapsible card so they're available throughout the week

- A delete button is also available on the week's list page – for deleting the week's data
- The shopping list appears below the weekly recipe list – ingredients are summed together
- The list is divided into categories – fruits, vegetables, meat, fish, dairy products, canned goods, etc.
- Purchased items can be checked off in the shopping list
- "Clear shopping list" button at the bottom of the list lets remove the checked items off the list

## Implementation

- HTML, CSS, TypeScript

- Databases – static data for foods, ingredients, and recipes stored in JSON files
- User data (weekly menu, shopping list, favorites) stored in localStorage
- OOP-style structure:

  Interfaces for JSON and localStorage data structures;

  Base classes: Recipe, Food, PlannerDay, PlannerEntry;

  Classes used for grouping base elements: RecipeStorage, FoodStorage, FavoritesStorage;

  Service classes: SearchManager, PlannerManager, ShoppingListManager, FavoritesManager,ServingsManager;

  Component classes - example: RecipeCardComponentComponent, InputComponent, ModalComponentComponent, PlannerEntryComponent, PlannerCardComponent etc.;

  Page Managers for implementation of connected classes;

  Reusable utility files: constants.ts, delay.ts, generateId.ts, insertElem.ts, roundIngredients.ts, typeScript.ts etc.
