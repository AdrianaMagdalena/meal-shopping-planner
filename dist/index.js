import { Navigation } from "./components/navigation.js";
import { delay } from "./utils/delay.js";
import { removeLoader } from "./utils/removeLoader.js";
const navigation = new Navigation("javascript:void(0)", "./pages/search.html", "./pages/planner.html", "./pages/week-list.html", "./pages/favorites.html");
(async () => {
    try {
        navigation.render(document.body);
        await delay(600);
    }
    finally {
        removeLoader();
    }
})();
