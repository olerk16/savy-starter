import * as components from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import axios from "axios";

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

  router.hooks({
    // We pass in the `done` function to the before hook handler to allow the function to tell Navigo we are finished with the before hook.
    // The `match` parameter is the data that is passed from Navigo to the before hook handler with details about the route being accessed.
    // https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match
    before: (done, match) => {
      // We need to know what view we are on to know what data to fetch
      const view = match?.data?.view ? camelCase(match.data.view) : "home";
      // Add a switch case statement to handle multiple routes
      switch (view) {
          case "home":
            console.log(process.env.OPEN_WEATHER_MAP_API_KEY)
            axios
              // Get request to retrieve the current weather data using the API key and providing a city name
              .get(
                `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&units=imperial&q=st%20louis`
              )
              .then(response => {
                // Create an object to be stored in the Home state from the response
                store.home.weather = {
                  city: response.data.name,
                  temp: response.data.main.temp,
                  feelsLike: response.data.main.feels_like,
                  description: response.data.weather[0].main
                };
                done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
            break;
        case "pizza":
          // New Axios get request utilizing already made environment variable
          axios
            .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
            .then(response => {
              store.pizza.pizzas = response.data;
              console.log("response", response);
              done();
            })
            .catch((error) => {
              console.log("It puked", error);
              done();
            });
            break;
        default :
          // We must call done for all views so we include default for the views that don't have cases above.
          done();
          // break is not needed since it is the last condition, if you move default higher in the stack then you should add the break statement.
      }
    },
    already: (match) => {
      const view = match?.data?.view ? camelCase(match.data.view) : "home";
  
      render(store[view]);
    },
    after: (match) => {
      router.updatePageLinks();
  
      // add menu toggle to bars icon in nav bar
      document.querySelector(".fa-bars").addEventListener("click", () => {
          document.querySelector("nav > ul").classList.toggle("hidden--mobile");
      });
    }
  });

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