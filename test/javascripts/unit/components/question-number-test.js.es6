import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import { discourseModule, exists } from "discourse/tests/helpers/qunit-helpers";
import hbs from "htmlbars-inline-precompile";

discourseModule("Unit | Component | question-number", function (hooks) {
  setupRenderingTest(hooks);

  componentTest("regular", {
    template: hbs`<QuestionNumber @position=1 @activeQuestionIndex=2 />`,

    test(assert) {
      assert.ok(
        exists("button.btn.btn-secondary"),
        "Non-selected buttons use btn-secondary class"
      );
    },
  });

  componentTest("active", {
    template: hbs`<QuestionNumber @position=1 @activeQuestion=1 />`,

    test(assert) {
      assert.ok(
        exists("button.btn.btn-primary"),
        "Selected button uses btn-primary class"
      );
    },
  });
});
