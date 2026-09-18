# Weekly Meal and Shopping Planner

## Application structure and operation:

**Navigation:**
Logo – Home page – Recipe search – Weekly menu builder – Favorites

**Home page:**

- Information about how to use the app (can be closed for this session or permanently\*)
- "Start weekly list building" block

**Recipe search:**

- Can be navigated to from the nav bar or the home page
- All recipes are listed upon arrival
- Recipe card:
  &emsp;&emsp;- Recipe data: name, cooking time, categories: diet (vegetarian, vegan, gluten-free, lactose-free), meal type (breakfast, lunch, dinner, snack)
  &emsp;&emsp;- "Mark as favorite" button
  &emsp;&emsp;- "Add to weekly list" button
- Search field searches by terms in the recipe title
- Additional filters for diet and meal type\*
- Clicking a recipe card displays the full recipe
- Marking as favorite saves the dish to a separate list
- "Add to weekly list" starts the weekly list building process

**Recipe page**

- Photo, ingredients (for 1 serving), description of recipe steps
- "Mark as favorite" button – saves the dish to a separate list
- "Add to weekly list" button – starts the weekly list building process
- "Adjust serving size" button – allows selecting multiple servings before adding to the weekly list
- If the recipe is added from the search page:
  &emsp;- A popup appears where you can specify how many servings and which day to add the ingredients to
  &emsp;- If a serving size was already set on the recipe page, the same number automatically appears in the popup, where it can still be modified

**Favorites list**

- Accessible from the nav bar
- Stores favorited recipes in alphabetical order
- Recipe cards are minimal – recipe name + "Add to weekly list" button
- If the recipe is added from the favorites page:
  &emsp;- A popup appears where you can specify how many servings and which day to add the ingredients to
- Clicking a recipe card displays the recipe (section d)

**Weekly menu builder**

- Accessible in 3 ways: from the nav bar, from search, or from favorites
- The list can be built for up to 7 days
- Multiple recipes and multiple servings can be added to each day
- If the recipe is added from search or favorites:
  &emsp;- A popup appears where you can specify how many servings and which day to add the ingredients to
  &emsp;- If a serving size was already set on the recipe page, the same number automatically appears in the popup, where it can still be modified
- If the recipe is added from the builder page itself, a popup redirects to the search page
- A given day can be copied – the same recipe list appears in the next day's block\*
- Each day's block allows adjusting the serving count\*
- "Done" button – confirms the weekly list; the shopping list is generated at this point
- Recipes in the weekly menu are placed into a collapsible card so they're available throughout the week without duplication
- A delete button is also available on the weekly menu card – for deleting the week's recipe list
- The shopping list appears below the weekly menu – ingredients are summed together
- The list is divided into categories – fruits, vegetables, meat, fish, dairy products, canned goods, etc.\*
- Purchased items can be checked off in the shopping list
- "Clear shopping list" button at the bottom of the list

## Implementation

- HTML, CSS, TypeScript, Jest
- Databases – static data for foods, ingredients, and recipes stored in JSON files, loaded via fetch()
- User data (weekly menu, shopping list, favorites) stored in localStorage and sessionStorage
- OOP-style structure:
  &emsp;- Base classes: Recipe, Ingredient, WeeklyMenuDay, ShoppingListItem
  &emsp;- Classes used for grouping base elements and managing lists: RecipeList, FavoritesList, WeeklyMenu, ShoppingList
- Writing tests using Jest
