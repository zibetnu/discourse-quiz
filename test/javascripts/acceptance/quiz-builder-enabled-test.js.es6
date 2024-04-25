import {
  acceptance,
  exists,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";
import { displayQuizBuilderButton } from "../helpers/display-quiz-builder-button";
import { test } from "qunit";

acceptance("Discourse Quiz - Quiz builder is enabled", function (needs) {
  needs.user();
  needs.settings({
    discourse_quiz_enabled: true,
  });
  needs.hooks.beforeEach(() => clearPopupMenuOptionsCallback());

  // Tests that the quiz builder pops up when enabled
  test("regular user", async function (assert) {
    updateCurrentUser({ moderator: false, admin: false, trust_level: 1 });

    await displayQuizBuilderButton();

    assert.ok(
      exists(".select-kit-row[data-name='Build Quiz']"),
      "it shows the builder button"
    );
  });
});
