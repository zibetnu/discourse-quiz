import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

// Component for a takeable question option
export default class TakeableQuestionOption extends Component {
  // Returns the Question's name
  @discourseComputed("questionIndex")
  questionName(questionIndex) {
    return `question_${questionIndex}_answer`;
  }

  // Returns the radio ID
  @discourseComputed("questionIndex", "index")
  radioId(questionIndex, index) {
    return `quiz_question_${questionIndex}_option_${index}`;
  }

  // Selects this question
  @action
  select() {
    this.setQuestionResponse(this.index);
  }
}
