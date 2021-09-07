import { acceptance, exists } from "discourse/tests/helpers/qunit-helpers";
import { openQuizBuilder } from "../helpers/open-quiz-builder";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";
import { click, fillIn } from "@ember/test-helpers";

acceptance("Discourse Quiz - UI Builder", function (needs) {
  needs.user();
  needs.settings({
    discourse_quiz_enabled: true,
  });
  needs.hooks.beforeEach(() => clearPopupMenuOptionsCallback());

  test("Modal opens", async function (assert) {
    await openQuizBuilder();
    assert.ok(exists("#discourse-modal-title"), "The modal title is present");
  });

  test("Add question", async function (assert) {
    await openQuizBuilder();

    assert.ok(exists('button[title="Add question"]'));

    // Assert that the modal opens with one question
    let questionButtons = document.querySelectorAll(".quiz-questions-nav-item");
    assert.equal(questionButtons.length, 1, "Modal starts with one question");

    // Add a question and verify that it was added
    await click('button[title="Add question"]');

    questionButtons = document.querySelectorAll(".quiz-questions-nav-item");
    assert.equal(
      questionButtons.length,
      2,
      "Add question button adds a question"
    );

    const activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    assert.equal(
      activeQuestion.innerText,
      "2",
      "Add question button sets new question as active"
    );
  });

  test("Delete question", async function (assert) {
    await openQuizBuilder();

    // Add 2 questions
    await click('button[title="Add question"]');
    await click('button[title="Add question"]');
    let questionButtons = document.querySelectorAll(".quiz-questions-nav-item");

    // Set question 2 as active question
    await click(questionButtons[1]);
    let activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    assert.equal(activeQuestion.innerText, "2", "Question 2 is active");

    // Click "Delete question" button
    await click(".quiz-question-controls button.btn-danger");
    await click(".bootbox.modal .btn-primary");

    questionButtons = document.querySelectorAll(".quiz-questions-nav-item");
    assert.equal(
      questionButtons.length,
      2,
      "Delete question button deletes a question"
    );
    const labelsAreUpdated =
      questionButtons[0].innerText === "1" &&
      questionButtons[1].innerText === "2";
    assert.ok(labelsAreUpdated, "Button labels match positions after delete");
    activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    assert.equal(activeQuestion.innerText, "2", "Question 2 is still active");

    // Click "Delete question" button (again)
    await click(".quiz-question-controls button.btn-danger");
    await click(".bootbox.modal .btn-primary");
    questionButtons = document.querySelectorAll(".quiz-questions-nav-item");
    activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    assert.equal(
      activeQuestion.innerText,
      "1",
      "Active question is updated if last question deleted"
    );
  });

  test("Add/remove option", async function (assert) {
    await openQuizBuilder();

    await fillIn(".new-quiz-option input");

    await click('button[title="Add option"]');
    let questionOptions = document.querySelectorAll(".quiz-question-option");
    assert.equal(questionOptions.length, 2, "An option was added");

    await click('button[title="Delete option"]');
    questionOptions = document.querySelectorAll(".quiz-question-option");
    assert.equal(questionOptions.length, 1, "An option was removed");
  });

  test("Reorder questions", async function (assert) {
    await openQuizBuilder();

    // Verify that both 'move' buttons are disabled
    let moveForward = document.querySelector("button[title='Move forward'");
    let moveBack = document.querySelector("button[title='Move back'");
    assert.ok(moveForward.attributes.disabled, "Move forward is disabled");
    assert.ok(moveBack.attributes.disabled, "Move forward is disabled");

    // Fill in first question with "a"
    await fillIn(".quiz-question-body textarea", "a");
    let textArea = document.querySelector(".quiz-question-body textarea");
    assert.ok(textArea.value === "a", "Question 1 text was inserted");

    // Fill in second question with "b"
    await click('button[title="Add question"]');
    await fillIn(".quiz-question-body textarea", "b");
    assert.ok(textArea.value === "b", "Question 2 text was inserted");

    // Verify that only the "move forward" button is enabled when last question is selected
    assert.notOk(moveForward.attributes.disabled);
    assert.ok(moveBack.attributes.disabled);

    // Fill in third question with "c"
    await click('button[title="Add question"]');
    await fillIn(".quiz-question-body textarea", "c");
    assert.ok(textArea.value === "c", "Question 3 text was inserted");

    // Test move forward
    await click("button[title='Move forward']");
    let activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    // Verify that the third question was moved to position 2
    assert.equal(
      activeQuestion.innerText,
      "2",
      "Question 2 is active after moving forward"
    );
    assert.ok(
      textArea.value === "c",
      "Question 2 contains old question 3 value"
    );

    // Verify that both the "move" buttons are enabled when niether first nor last question is selected
    assert.notOk(moveForward.attributes.disabled);
    assert.notOk(moveBack.attributes.disabled);

    // Test move back
    await click("button[title='Move back']");
    activeQuestion = document.querySelector(
      ".quiz-questions-nav-item.btn-primary"
    );
    assert.equal(
      activeQuestion.innerText,
      "3",
      "Question 3 is active after moving back"
    );
    assert.ok(
      textArea.value === "c",
      "Question 3 contains original question 3 value"
    );
  });

  test("Question format toggle", async function (assert) {
    await openQuizBuilder();

    let selectedFormat = document.querySelector(
      ".quiz-question-formats button.btn-primary"
    );
    assert.ok(
      selectedFormat.innerText === "Multiple Choice",
      "Multiple choice is selected"
    );

    await click(".quiz-question-formats button.btn-flat");
    selectedFormat = document.querySelector(
      ".quiz-question-formats button.btn-primary"
    );
    assert.ok(
      selectedFormat.innerText === "True/False",
      "True/False is selected"
    );

    let questionOptions = document.querySelectorAll(".quiz-question-option");
    let test =
      questionOptions[0].innerText === "True" &&
      questionOptions[1].innerText === "False";
    assert.ok(test, "True/False displays 'True' and 'False' options");
  });
});
