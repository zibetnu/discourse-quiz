import hbs from "discourse/widgets/hbs-compiler";
import { createWidget } from "discourse/widgets/widget";

export default createWidget("start-quiz-button", {
  tagName: "button.btn.btn-secondary",

  click() {
    // this.sendWidgetAction("changeWatchingInviteeStatus", "going");
  },

  template: hbs`
    <span class="label">
      {{i18n "discourse_quiz.widget.results"}}
    </span>
  `,
});
