import QuizUiBuilder from "../components/modal/quiz-ui-builder";
import { withPluginApi } from "discourse/lib/plugin-api";

function initializeQuizUIBuilder(api) {
  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      api.container.lookup("service:modal").show(QuizUiBuilder, {
        model: { toolbarEvent },
      });
    },
    icon: "graduation-cap",
    label: "discourse_quiz.ui_builder.title",
    condition: () => {
      const siteSettings = api.container.lookup("service:site-settings");
      return siteSettings.discourse_quiz_enabled;
    },
  });
}

export default {
  name: "add-quiz-ui-builder",

  initialize() {
    withPluginApi("0.8.7", initializeQuizUIBuilder);
  },
};
