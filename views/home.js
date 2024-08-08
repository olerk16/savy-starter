import html from "html-literal";

export default state => html`
<section id="jumbotron">
<h3 style="
  color: black;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
">
    The weather in ${state.weather.city} is ${state.weather.description}. Temperature is ${state.weather.temp}F, and it feels like ${state.weather.feelsLike}F.
  </h3><h2>SavvyCoders JavaScript Fullstack Bootcamp</h2>

<a href="index.html">"Call to Action" "Button"</a>
</section>`;