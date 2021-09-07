import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  @discourseComputed("index")
  position(index) {
    return index + 1;
  },

  @discourseComputed("activeQuestionIndex", "index")
  isActive(activeQuestionIndex, index) {
    return activeQuestionIndex === index;
  },

  actions: {
    setActive() {
      this.changeActive(this.index);
    },
  },
});
