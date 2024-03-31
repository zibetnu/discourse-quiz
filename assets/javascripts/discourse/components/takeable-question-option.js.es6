import Component from "@ember/component";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

export default class TakeableQuestionOption extends Component {
  @discourseComputed("questionIndex")
  questionName(questionIndex) {
    return `question_${questionIndex}_answer`;
  }

  @discourseComputed("questionIndex", "index")
  radioId(questionIndex, index) {
    return `quiz_question_${questionIndex}_option_${index}`;
  }

  @action
  select() {
    console.log(this.index);
  }
}
