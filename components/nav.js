import html from "html-literal";
import navItem from "./navItem";

export default navItems => {
  console.log("navItems",navItems);
  return html`
    <nav>
      <i class="fas fa-bars"></i>
      <ul class="">
      ${Array.isArray(navItems) ? navItems.map(item => navItem(item)).join("") : ""} 
      <!-- added check because had issues with finding links array -->
      </ul>
    </nav>
  `;
}
