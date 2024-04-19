import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  newQuizOption: "",

  @discourseComputed("format")
  isMultipleChoice(format) {
    return format === "multiple_choice";
  },

  @discourseComputed("format")
  isTrueFalse(format) {
    return format === "true_false";
  },

  @discourseComputed("index", "numQuestions")
  isLastQuestion(index, numQuestions) {
    return index === numQuestions - 1;
  },

  @discourseComputed("index")
  isFirstQuestion(index) {
    return index === 0;
  },

  @action
  setFormat(newFormat) {
    this.set("format", newFormat);
  },

  @action
  setQuestionResponse(questionResponse) {
    this.setQuestionResponseFor(this.id, questionResponse);
  },

  @action
  delete() {
    this.deleteQuestion(this.index);
  },

  @action
  move(positions) {
    this.moveQuestion(this.index, positions);
  },
});
