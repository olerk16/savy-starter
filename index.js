import * as components from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";

const router = new Navigo("/");

import { header, nav, main, footer } from "./components";

function render(state = store.home) {
    document.querySelector("#root").innerHTML = `
        ${header(state)}
        ${nav(store.nav)}
        ${main(state)}
        ${footer()}
      `;

      router.updatePageLinks();
  }
  
  router.on("/", () => render(store.home)).resolve();

  router
      .on({
        "/": () => render(store.home),
        ":view": (match) => {
          const view = match?.data?.view ? camelCase(match.data.view) : "home";
          if (view in store) {
            render(store[view]);
          } else {
            render(store.viewNotFound);
            console.log(`View ${view} not defined`);
          }
        },
      })
      .resolve();