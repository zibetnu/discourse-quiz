import selectKit from "discourse/tests/helpers/select-kit-helper";
import { click, visit } from "@ember/test-helpers";

// Function to pull up the quiz builder button
export async function displayQuizBuilderButton() {
  await visit("/");
  await click("#create-topic");
  await click(".d-editor-button-bar .options");
  await selectKit(".toolbar-popup-menu-options").expand();
}
