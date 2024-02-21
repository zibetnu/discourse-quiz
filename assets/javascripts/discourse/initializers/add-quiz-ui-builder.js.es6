import discourseComputed from "discourse-common/utils/decorators";
import QuizUiBuilder from "../components/modal/quiz-ui-builder";
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeQuizUIBuilder(api) {
  api.modifyClass("controller:composer", {
    @discourseComputed("siteSettings.discourse_quiz_enabled")
    canBuildQuiz(discourseQuizEnabled) {
      return discourseQuizEnabled;
    },

    actions: {
      showQuizBuilder() {
        api.container.lookup("service:modal").show(QuizUiBuilder, {
          model: { toolbarEvent },
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

  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      api.container.lookup("service:modal").show(QuizUiBuilder, {
        model: { toolbarEvent },
      });
    },
    icon: "graduation-cap",
    label: "discourse_quiz.ui_builder.title",
    condition: (composer) => "canBuildQuiz",
  });
}

export default {
  name: "add-quiz-ui-builder",

  initialize() {
    withPluginApi("0.8.7", initializeQuizUIBuilder);
  },
};
