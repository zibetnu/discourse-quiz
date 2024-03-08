import hbs from "discourse/widgets/hbs-compiler";
import { createWidget } from "discourse/widgets/widget";
import { getOwner } from "@ember/application";
import QuizUiTaker from "../components/modal/quiz-ui-taker";

export default createWidget("start-quiz-button", {
  tagName: "button.btn.btn-primary",

  buildKey: (attrs) => `start-quiz-button-${attrs.id}`,

  defaultState(attrs) {
    return {
      model: attrs.model,
    };
  },

  click() {
    this.store
    .find("discourse-quiz-question", { quiz_id: this.state.model.id })
    .then((resp) => {
      getOwner(this).lookup("service:modal").show(QuizUiTaker, {
        model: {
          questions: resp.content,
          activeQuestionIndex: 0,
          id: this.state.model.id,
          post_id: this.state.model.post_id,
        },
      });
    });
  },

  template: hbs`
    <span class="label">
      {{i18n "discourse_quiz.widget.start"}}
    </span>
  `,
});
