import QuizUiBuilder from "../components/modal/quiz-ui-builder";
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeQuizUIBuilder(api) {
  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      api.container.lookup("service:modal").show(QuizUiBuilder, {
        model: {
          toolbarEvent,
          questions: [{
            format: "multiple_choice",
            answer: null,
            options: [],
            text: "",
            error: null,
          }],
          activeQuestionIndex: 0,
          mode: "create",
        },
      });
    },
    icon: "graduation-cap",
    label: "discourse_quiz.ui_builder.title",
    condition: (composer) => {
      const composerModel = composer.model;
      const siteSettings = api.container.lookup("service:site-settings");

      return (
        siteSettings.discourse_quiz_enabled &&
        !composerModel.replyingToTopic &&
        (composerModel.topicFirstPost ||
          (composerModel.editingPost &&
            composerModel.post &&
            composerModel.post.post_number === 1))
      );
    },
  });
}

export default {
  name: "add-quiz-ui-builder",

  initialize() {
    withPluginApi("0.8.7", initializeQuizUIBuilder);
  },
};
