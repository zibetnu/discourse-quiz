import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

// Component for the question body
export default Component.extend({
  newQuizOption: "",

  // Returns true if this question is Multiple Choice
  @discourseComputed("format")
  isMultipleChoice(format) {
    return format === "multiple_choice";
  },

  // Returns true if this question is True/False
  @discourseComputed("format")
  isTrueFalse(format) {
    return format === "true_false";
  },

  // Checks if this is the last question
  @discourseComputed("index", "numQuestions")
  isLastQuestion(index, numQuestions) {
    return index === numQuestions - 1;
  },

  // Checks if this is the first question
  @discourseComputed("index")
  isFirstQuestion(index) {
    return index === 0;
  },

  // Changes the format (Multiple Choice or True/False)
  @action
  setFormat(newFormat) {
    this.set("format", newFormat);
  },

  // Sets the answer for this question
  @action
  setAnswer(newAnswer) {
    this.changeAnswer(this.index, newAnswer);
  },

  // Removes an option from a question
  @action
  removeOption(option_index) {
    this.removeQuestionOption(this.index, option_index);
  },

  // Adds an option to a question
  @action
  addOption() {
    if (this.newQuizOption !== "") {
      this.addQuestionOption(this.index, this.newQuizOption);
      this.set("newQuizOption", "");

      const newOptionInput = document.querySelector(".new-quiz-option input");
      if (newOptionInput) {
        newOptionInput.focus();
      }
    }
  },

  // Delete the current question
  @action
  delete() {
    this.deleteQuestion(this.index);
  },

  // Move the current question
  @action
  move(positions) {
    this.moveQuestion(this.index, positions);
  },
});
