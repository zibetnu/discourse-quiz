import { displayQuizBuilderButton } from "./display-quiz-builder-button";
import { click } from "@ember/test-helpers";

export async function openQuizBuilder() {
  await displayQuizBuilderButton();
  await click(".select-kit-row[data-value='showQuizBuilder']");
}
