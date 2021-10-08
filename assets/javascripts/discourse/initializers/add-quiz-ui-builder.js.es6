import discourseComputed from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeQuizUIBuilder(api) {
  api.modifyClass("controller:composer", {
    @discourseComputed("siteSettings.discourse_quiz_enabled")
    canBuildQuiz(discourseQuizEnabled) {
      return discourseQuizEnabled;
    },

    actions: {
      showQuizBuilder() {
        showModal("quiz-ui-builder").setProperties({
          toolbarEvent: this.toolbarEvent,
          questions: [
            {
              format: "multiple_choice",
              answer: null,
              options: [],
              text: "",
              error: null,
            },
          ],
          activeQuestionIndex: 0,
          mode: "create",
        });
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback((composerController) => {
    const composerModel = composerController.model;
    if (
      composerModel &&
      !composerModel.replyingToTopic &&
      (composerModel.topicFirstPost ||
        (composerModel.editingPost &&
          composerModel.post &&
          composerModel.post.post_number === 1))
    ) {
      return {
        action: "showQuizBuilder",
        icon: "graduation-cap",
        label: "discourse_quiz.ui_builder.title",
        condition: "canBuildQuiz",
      };
    }
  });
}

export default {
  name: "add-quiz-ui-builder",

  initialize() {
    withPluginApi("0.8.7", initializeQuizUIBuilder);
  },
};
