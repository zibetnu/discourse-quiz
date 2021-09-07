import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  @discourseComputed("answer", "index")
  isSelected(answer, index) {
    return answer === index;
  },

  @discourseComputed("questionIndex")
  questionName(questionIndex) {
    return `question_${questionIndex}_answer`;
  },

  @discourseComputed("questionIndex", "index")
  radioId(questionIndex, index) {
    return `quiz_question_${questionIndex}_option_${index}`;
  },

  @action
  select() {
    this.setAnswer(this.index);
  },

  @action
  delete() {
    this.removeOption(this.index);
  },
});
