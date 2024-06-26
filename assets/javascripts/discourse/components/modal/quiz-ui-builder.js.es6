import Component from "@ember/component";
import { action, set } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";
import { cook } from "discourse/lib/text";
import { extractError } from "discourse/lib/ajax-error";
import { inject as service } from "@ember/service";

export default class QuizUiBuilderModal extends Component {
  @service dialog;

  isLoading = false;
  flash = "";

  @discourseComputed("model.activeQuestionIndex", "model.questions")
  activeQuestion(activeQuestionIndex, questions) {
    return questions[activeQuestionIndex];
  }

  @discourseComputed("model.mode")
  inCreateMode(mode) {
    return mode === "create";
  }

  @discourseComputed("model.mode")
  inUpdateMode(mode) {
    return mode === "update";
  }

  @action
  changeActive(newActive) {
    set(this.model, "activeQuestionIndex", newActive);
  }

  @action
  changeAnswer(questionIndex, answer) {
    set(this.model.questions[questionIndex], "answer", answer);
  }

  @action
  removeQuestionOption(questionIndex, optionIndex) {
    if (this.model.questions[questionIndex].answer === optionIndex) {
      set(this.model.questions[questionIndex], "answer", null);
    } else if (optionIndex < this.model.questions[questionIndex].answer) {
      set(
        this.model.questions[questionIndex],
        "answer",
        this.model.questions[questionIndex].answer - 1
      );
    }
    this.model.questions[questionIndex].options.removeAt(optionIndex);
  }

  @action
  addQuestionOption(questionIndex, optionText) {
    this.model.questions[questionIndex].options.pushObject(optionText);
  }

  @action
  addQuestion() {
    this.model.questions.pushObject({
      format: "multiple_choice",
      text: "",
      options: [],
      answer: null,
      error: null,
    });
    set(this.model, "activeQuestionIndex", this.model.questions.length - 1);
  }

  @action
  deleteQuestion(questionIndex) {
    this.dialog.deleteConfirm({
      message: I18n.t("discourse_quiz.ui_builder.confirm_delete_question"),
      didConfirm: () => {
        let deletingLast = questionIndex === this.model.questions.length - 1;
        this.model.questions.removeAt(questionIndex);
        if (deletingLast) {
          this.changeActive(questionIndex - 1);
        } else {
          this.changeActive(null); // set null first to force refresh
          this.changeActive(questionIndex);
        }
        window.setTimeout(function () {
          const deleteButton = document.querySelector(
            ".quiz-question-controls button.btn-danger"
          );
          if (deleteButton) {
            // Keep focus on delete button if possible
            deleteButton.focus();
          } else {
            // When all questions have been deleted, focus on the "Add question" button
            document.querySelector(".quiz-questions-nav button").focus();
          }
        }, 0);
      },
    });
  }

  @action
  moveQuestion(questionIndex, positions) {
    /*
      Move question at @questionIndex from current position to current position + @positions

      Set @positions to a negative number to move forward, positive to move backward

      Recursive if absolute value of @positions > 1
    */

    if (positions > 0) {
      // Swap this question with the one immediately behind it
      const question1 = this.model.questions[questionIndex];
      const question2 = this.model.questions[questionIndex + 1];
      this.model.questions
        .replace(questionIndex + 1, 1, [question1])
        .replace(questionIndex, 1, [question2]);
      set(this.model.questions[questionIndex], "position", questionIndex + 1);
      set(this.model.questions[questionIndex + 1], "position", questionIndex + 2);
      if (positions === 1) {
        set(this.model, "activeQuestionIndex", questionIndex + 1);
        return;
      } else {
        // Continue swapping back until desired number of positions moved
        return this.moveQuestion(questionIndex + 1, positions - 1);
      }
    } else {
      // Swap this question with the one immediately before it
      const question1 = this.model.questions[questionIndex];
      const question2 = this.model.questions[questionIndex - 1];
      this.model.questions
        .replace(questionIndex - 1, 1, [question1])
        .replace(questionIndex, 1, [question2]);
      set(this.model.questions[questionIndex], "position", questionIndex + 1);
      set(this.model.questions[questionIndex - 1], "position", questionIndex);
      if (positions === -1) {
        set(this.model, "activeQuestionIndex", questionIndex - 1);
        return;
      } else {
        // Continue swapping forward until desired number of positions moved
        return this.moveQuestion(questionIndex - 1, positions + 1);
      }
    }
  }

  verify() {
    let isError = false;
    if (this.model.questions.length === 0) {
      this.dialog.alert("Error: Quiz must contain at least one question", () => {
        // return focus to "Insert Quiz" button
        window.setTimeout(function () {
          document.querySelector(".modal-footer button.btn-primary").focus();
        }, 0);
      });
      isError = true;
      return !isError;
    }

    for (const [index, question] of this.model.questions.entries()) {
      if (question.text === "") {
        set(this.model.questions[index], "error", "Question text must not be empty");
        isError = true;
      } else if (
        question.format === "multiple_choice" &&
        question.options.length < 2
      ) {
        set(
          this.model.questions[index],
          "error",
          "Multiple choice questions must have at least two options"
        );
        isError = true;
      } else if (question.answer === null) {
        set(this.model.questions[index], "error", "Please select the correct answer");
        isError = true;
      } else {
        set(this.model.questions[index], "error", null);
      }
    }

    if (isError) {
      this.dialog.alert("One or more questions contains an error", () => {
        // return focus to "Insert Quiz" button
        window.setTimeout(function () {
          document.querySelector(".modal-footer button.btn-primary").focus();
        }, 0);
      });
    }

    return !isError;
  }

  formatOutput() {
    let lines = ["[quiz]"];
    for (const question of this.model.questions) {
      lines.push(`[question format="${question.format}"]`);
      lines.push(question.text);
      if (question.format === "multiple_choice") {
        for (const [index, option] of question.options.entries()) {
          if (index === parseInt(question.answer, 10)) {
            lines.push(`** ${option}`);
          } else {
            lines.push(`* ${option}`);
          }
        }
      } else if (question.format === "true_false") {
        if (question.answer === "true") {
          lines.push("** True");
          lines.push("* False");
        } else {
          lines.push("* True");
          lines.push("** False");
        }
      }
      lines.push("[/question]");
    }
    lines.push("[/quiz]");
    return lines.join("\n");
  }

  @action
  upsertQuiz() {
    if (this.verify()) {
      if (this.inCreateMode) {
        this.model.toolbarEvent.addText(this.formatOutput());
        this.closeModal();
      } else if (this.inUpdateMode) {
        this.set("isLoading", true);
        this.store
          .find("post", this.model.post_id)
          .then((post) => {
            const quiz_pattern = /\[quiz[\s\S]*?\[\/quiz\]/;
            const newRaw = post.raw.replace(quiz_pattern, this.formatOutput());
            const props = {
              raw: newRaw,
              edit_reason: I18n.t(
                "discourse_quiz.ui_builder.edit_reason_update"
              ),
            };

            return cook(newRaw).then((cooked) => {
              props.cooked = cooked.string;
              return post
                .save(props)
                .catch((e) => {
                  this.set("isLoading", false);
                  this.set("flash", extractError(e))
                })
                .then(() => {
                  this.set("isLoading", false);
                  this.closeModal();
                });
            });
          })
          .catch((e) => {
            this.set("isLoading", false);
            this.set("flash", extractError(e))
          });
      }
    }
  }
};
