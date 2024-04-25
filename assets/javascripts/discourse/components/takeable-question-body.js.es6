import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

// Component for a takeable question body
export default Component.extend({
  newQuizOption: "",

  // True if Multiple Choice question
  @discourseComputed("format")
  isMultipleChoice(format) {
    return format === "multiple_choice";
  },

  // True if True/False Question
  @discourseComputed("format")
  isTrueFalse(format) {
    return format === "true_false";
  },

  // True if is last question
  @discourseComputed("index", "numQuestions")
  isLastQuestion(index, numQuestions) {
    return index === numQuestions - 1;
  },

  // True if is first question
  @discourseComputed("index")
  isFirstQuestion(index) {
    return index === 0;
  },

  // Set's the question format
  @action
  setFormat(newFormat) {
    this.set("format", newFormat);
  },

  // Sets the question response
  @action
  setQuestionResponse(questionResponse) {
    this.setQuestionResponseFor(this.id, questionResponse);
  },

  // Deletes this question
  @action
  delete() {
    this.deleteQuestion(this.index);
  },

  // Move this question to a different position
  @action
  move(positions) {
    this.moveQuestion(this.index, positions);
  },
});
