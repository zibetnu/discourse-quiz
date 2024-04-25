import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import { discourseModule, exists } from "discourse/tests/helpers/qunit-helpers";
import hbs from "htmlbars-inline-precompile";

discourseModule("Unit | Component | question-number", function (hooks) {
  setupRenderingTest(hooks);

  // Tests that a selected button shows up as selected
  componentTest("regular", {
    template: hbs`<QuestionNumber @index=0 @activeQuestionIndex=2 />`,

    test(assert) {
      assert.ok(
        exists("button.btn.btn-secondary"),
        "Non-selected buttons use btn-secondary class"
      );
    },
  });

  // Tests that a non-selected button doesn't show as selected
  componentTest("active", {
    template: hbs`<QuestionNumber @index=0 @activeQuestionIndex=0 />`,

    test(assert) {
      assert.ok(
        exists("button.btn.btn-primary"),
        "Selected button uses btn-primary class"
      );
    },
  });
});
