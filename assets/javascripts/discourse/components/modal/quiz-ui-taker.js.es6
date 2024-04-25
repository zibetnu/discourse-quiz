import Component from "@ember/component";
import { action, set } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";
import { extractError } from "discourse/lib/ajax-error";
import { inject as service } from "@ember/service";

// Class actions for taking a quiz
export default class QuizUiTakerModal extends Component {
    @service dialog;

    flash = "";
    isLoading = false;
    questionResponses = {};
    startedAt = new Date().toISOString();

    // Retrieves the active question
    @discourseComputed("model.activeQuestionIndex", "model.questions")
    activeQuestion(activeQuestionIndex, questions) {
      return questions[activeQuestionIndex];
    }

    // Changes the active question
    @action
    changeActive(newActive) {
      set(this.model, "activeQuestionIndex", newActive);
    }

    // Sets the response for a question
    @action
    setQuestionResponseFor(questionID, questionResponse) {
      this.questionResponses[questionID] = questionResponse;
    }

    // Submit the quiz upon completion
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
      .then((response) => {
        for (let questionID in this.questionResponses) {
          ajax({
            type: "POST",
            url: `/quizzes/attempts/question_responses`,
            data: {
              quiz_question_response: {
                answer: this.questionResponses[questionID],
                quiz_attempt_id: response.quiz_attempt.id,
                quiz_question_id: questionID,
              },
            },
          });
        }
        this.closeModal();
      });
    }
}
