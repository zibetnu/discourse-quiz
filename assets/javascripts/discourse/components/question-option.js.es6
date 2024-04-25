import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

// Component for question answer options
export default Component.extend({
  // True if this answer is selected
  @discourseComputed("answer", "index")
  isSelected(answer, index) {
    return answer === index || parseInt(answer, 10) === index;
  },

  // Returns the question's name
  @discourseComputed("questionIndex")
  questionName(questionIndex) {
    return `question_${questionIndex}_answer`;
  },

  // Returns the radio ID
  @discourseComputed("questionIndex", "index")
  radioId(questionIndex, index) {
    return `quiz_question_${questionIndex}_option_${index}`;
  },

  // Selects this option
  @action
  select() {
    this.setAnswer(this.index);
  },

  // Deletes this option
  @action
  delete() {
    this.removeOption(this.index);
  },
});
