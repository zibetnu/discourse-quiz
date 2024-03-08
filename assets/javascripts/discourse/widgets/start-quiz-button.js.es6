import hbs from "discourse/widgets/hbs-compiler";
import { createWidget } from "discourse/widgets/widget";

export default createWidget("start-quiz-button", {
  tagName: "button.btn.btn-primary",

  buildKey: (attrs) => `start-quiz-button-${attrs.id}`,

  defaultState(attrs) {
    return {
      model: attrs.model,
    };
  },

  click() {
    // this.sendWidgetAction("changeWatchingInviteeStatus", "going");
  },

  template: hbs`
    <span class="label">
      {{i18n "discourse_quiz.widget.start"}}
    </span>
  `,
});
