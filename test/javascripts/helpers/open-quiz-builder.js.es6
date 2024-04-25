import { displayQuizBuilderButton } from "./display-quiz-builder-button";
import { click } from "@ember/test-helpers";

// Opens the quiz builder
export async function openQuizBuilder() {
  await displayQuizBuilderButton();
  await click(".select-kit-row[data-name='Build Quiz']");
}
