import { discourseModule } from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";

discourseModule("Unit | Controller | quiz-ui-builder", function () {
  test("changeActive() changes activeQuestion", function (assert) {
    const controller = this.getController("quiz-ui-builder");

    controller.setProperties({
      questions: [
        {
          format: "multiple_choice",
          text: "Question1",
          options: ["a", "b"],
          answer: 0,
          error: null,
        },
        {
          format: "multiple_choice",
          text: "Question2",
          options: ["a", "b"],
          answer: 1,
          error: null,
        },
      ],
      activeQuestionIndex: 1,
    });

    controller.changeActive(2);

    assert.equal(
      controller.get("activeQuestionIndex"),
      2,
      "Sets activeQuestion"
    );
  });
});
