import { withPluginApi } from "discourse/lib/plugin-api";
import WidgetGlue from "discourse/widgets/glue";
import { cook } from "discourse/lib/text";
import { getRegister } from "discourse-common/lib/get-owner";
import { schedule } from "@ember/runloop";
import { applyLocalDates } from "discourse/plugins/discourse-local-dates/initializers/discourse-local-dates";

function appendWidget(element, name, register, attrs) {
  const glue = new WidgetGlue("discourse-quiz", register, attrs);
  glue.appendTo(element);
}

function extractDates(siteSettings, quiz) {
  const dates = [];
  if (siteSettings.discourse_local_dates_enabled) {
    if (quiz.open_at && quiz.close_at) {
      dates.push(
        `[date=${moment
          .utc(quiz.open_at)
          .format("YYYY-MM-DD")} time=${moment
          .utc(quiz.open_at)
          .format("HH:mm")} format="LLL"]`
      );
      dates.push(
        `[date=${moment
          .utc(quiz.close_at)
          .format("YYYY-MM-DD")} time=${moment
          .utc(quiz.close_at)
          .format("HH:mm")} format="LLL"]`
      );
    } else if (quiz.open_at) {
      dates.push(
        `Opens [date=${moment
          .utc(quiz.open_at)
          .format("YYYY-MM-DD")} time=${moment
          .utc(quiz.open_at)
          .format("HH:mm")} format="LLL"]`
      );
    } else if (quiz.close_at) {
      dates.push(
        `Closes [date=${moment
          .utc(quiz.close_at)
          .format("YYYY-MM-DD")} time=${moment
          .utc(quiz.close_at)
          .format("HH:mm")} format="LLL"]`
      );
    }
  } else {
    if (quiz.open_at && quiz.close_at) {
      dates.push(moment.utc(quiz.open_at).format());
      dates.push(moment.utc(quiz.close_at).format());
    } else if (quiz.open_at) {
      dates.push(`Opens ${moment.utc(quiz.open_at).format()}`);
    } else if (quiz.close_at) {
      dates.push(`Closes ${moment.utc(quiz.close_at).format()}`);
    }
    if (quiz.close_at) {
      dates.push(moment.utc(quiz.close_at).format());
    }
  }
  return dates.join("<span> → </span>");
}

function formatTimeLimit(opts) {
  let formattedTimeLimit = "None";
  if (opts.attrs.model && opts.attrs.model.time_limit) {
    const duration = moment.duration(opts.attrs.model.time_limit, "seconds");
    if (opts.attrs.model.time_limit < 3600) {
      formattedTimeLimit = duration.minutes() + "m";
    } else {
      formattedTimeLimit = `${duration.hours()}h ${duration.minutes()}m`;
    }
  }
  return formattedTimeLimit;
}

function decorateQuiz(api, cooked, opts) {
  const quizContainer = cooked.querySelector(".quiz");
  quizContainer.innerHTML = "";
  const siteSettings = api.container.lookup("site-settings:main");
  const dates = opts.attrs.model
    ? extractDates(siteSettings, opts.attrs.model)
    : "";
  cook(dates).then((result) => {
    appendWidget(quizContainer, "discourse-quiz", getRegister(api), {
      id: "discourse-quiz",
      dates: result,
      formattedTimeLimit: formatTimeLimit(opts),
      ...opts.attrs,
    });
    schedule("afterRender", () => {
      const localDates = cooked.querySelectorAll(".discourse-local-date");
      if (localDates.length > 0) {
        applyLocalDates(localDates, siteSettings);
      }
    });
  });
}

function initializeQuizDecorator(api) {
  api.decorateCookedElement(
    (cooked, helper) => {
      const quizContainer = cooked.querySelector(".quiz");
      if (quizContainer) {
        if (helper) {
          const post = helper.getModel();
          if (post && post.quiz) {
            const opts = {
              attrs: {
                model: post.quiz,
              },
            };
            decorateQuiz(api, cooked, opts);
          }
        } else {
          // Composer preview (no model available)
          decorateQuiz(api, cooked, { attrs: {} });
        }
      }
    },
    { id: "discourse-quiz" }
  );
  return api;
}

export default {
  name: "add-quiz-decorator",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.discourse_quiz_enabled) {
      withPluginApi("0.8.7", initializeQuizDecorator);
    }
  },
};
