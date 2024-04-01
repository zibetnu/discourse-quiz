import Component from "@ember/component";
import { action, set } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";
import { extractError } from "discourse/lib/ajax-error";
import { inject as service } from "@ember/service";

export default class QuizUiTakerModal extends Component {
    @service dialog;

    flash = "";
    isLoading = false;
    questionResponses = {};
    startedAt = new Date().toISOString();

    @discourseComputed("model.activeQuestionIndex", "model.questions")
    activeQuestion(activeQuestionIndex, questions) {
      return questions[activeQuestionIndex];
    }

    @action
    changeActive(newActive) {
      set(this.model, "activeQuestionIndex", newActive);
    }

    @action
    setQuestionResponseFor(questionID, questionResponse) {
      this.questionResponses[questionID] = questionResponse;
    }

    @action
    submitQuiz() {
      ajax(`/quizzes/${this.model.id}/attempts`, {
        type: "POST",
        data: {
          quiz_attempt: {
            finished_at: new Date().toISOString(),
            started_at: this.startedAt,
            user_id: this.currentUser.id,
            quiz_id: this.model.id,
          }
        },
      })
      .then(() => {
        this.closeModal();
      });
    }
}
