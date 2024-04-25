import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

// Component for question number
export default Component.extend({
  // Computes the Question Number
  @discourseComputed("index")
  position(index) {
    return index + 1;
  },

  // True if active question
  @discourseComputed("activeQuestionIndex", "index")
  isActive(activeQuestionIndex, index) {
    return activeQuestionIndex === index;
  },

  actions: {
    // Set's current question as the active question
    setActive() {
      this.changeActive(this.index);
    },
  },
});
