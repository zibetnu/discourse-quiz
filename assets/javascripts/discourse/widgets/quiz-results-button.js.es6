import { ajax } from "discourse/lib/ajax";
import hbs from "discourse/widgets/hbs-compiler";
import { createWidget } from "discourse/widgets/widget";

export default createWidget("quiz-results-button", {
  tagName: "button.btn.btn-secondary",

  buildKey: (attrs) => `quiz-results-button-${attrs.id}`,

  defaultState(attrs) {
    return {
      model: attrs.model,
    };
  },

  // TODO: overhaul quiz results screen.
  async click() {
    let resultsString = "Results\n";
    const attempts = await ajax(`/quizzes/${this.state.model.id}/attempts`,
      {type: "GET"}
    );
    const questions = await ajax(`/quizzes/${this.state.model.id}/questions`,
      {type: "GET"}
    );
    for (const attempt of attempts.quiz_attempts) {
      resultsString += `Attempt ${attempt.id}:\n`;
      const questionResponses = await ajax({
        type: "GET",
        url: `/quizzes/attempts/${attempt.id}/question_responses`,
      });
      questions.quiz_questions.forEach((question, index) => {
        const response = questionResponses.quiz_question_responses.find(
          (qr) => qr.quiz_question_id === question.id
        );
        console.log(response);
        resultsString += `#${index + 1}: ${question.text}\n`;
        resultsString += `Correct answer: ${question.answer}\n`;
        resultsString += `Response: ${response ? response.answer : "No response"}\n`;
      });
      resultsString += "\n";
    }

    alert(resultsString);
  },

  template: hbs`
    <span class="label">
      {{i18n "discourse_quiz.widget.results"}}
    </span>
  `,
});
