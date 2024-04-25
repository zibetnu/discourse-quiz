import {
  acceptance,
  exists,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";
import { displayQuizBuilderButton } from "../helpers/display-quiz-builder-button";
import { test } from "qunit";

acceptance("Discourse Quiz - Quiz builder is disabled", function (needs) {
  needs.user();
  needs.settings({
    discourse_quiz_enabled: false,
  });
  needs.hooks.beforeEach(() => clearPopupMenuOptionsCallback());

  // Tests when the Quiz Builder is disabled
  test("regular user", async function (assert) {
    updateCurrentUser({ moderator: false, admin: false, trust_level: 1 });

    await displayQuizBuilderButton();

    assert.ok(
      !exists(".select-kit-row[data-name='Build Quiz']"),
      "it hides the builder button"
    );
  });
});
