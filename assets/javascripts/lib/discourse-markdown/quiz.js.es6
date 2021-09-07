import I18n from "I18n";

const quizRule = {
  tag: "quiz",

  replace: function (state, tagInfo, raw) {
    let token = state.push("div_open", "div", 1);
    token.attrs = [["class", "quiz"]];
    token.content = raw;

    const src = state.src;
    const quiz = parseQuiz(src);

    // Temorarily calling quiz.questions to avoid linting errors
    quiz.questions;

    let titleH2Token = state.push("h2_open", "h2", 1);
    titleH2Token.attrs = [["class", "quiz-title"]];
    token = state.push("text", 0);
    token.content = I18n.t("discourse_quiz.widget.title", { count: 0 });
    state.push("h2_close", "h2", -1);
    state.push("div_close", "div", -1);

    return true;
  },
};

function parseQuiz(src) {
  // Set up data structure
  const data = {
    questions: [],
  };

  // Define regex patterns
  const questionPattern = /\[question .*?\][\s\S]*?\[\/question\]/g; // Get all questions in quiz
  const QuestionAttrsPattern = /\[question (.*?)\]/; // Get all question attributes
  const questionAttrPattern = /(\w+)="(\w+)"/; // Extract attribute info for individual attribute
  const questionTextPattern = /\[question .*\]\s([\s\S]*?)\n\*/; // Extract question text
  const questionOptionsPattern = /\*+ .*/g; // Get all options for a given question
  const questionOptionPattern = /(\*+?) (\w*)/; // Extract option info for individual option

  // Parse results using patterns
  const questionStringsArray = src.match(questionPattern);
  for (const questionString of questionStringsArray) {
    const question = {
      options: [],
      answer: null,
      text: null,
    };

    // Parse question attributes
    const questionAttrsString = questionString.match(QuestionAttrsPattern);
    const questionAttrsPairs = questionAttrsString[1].split(" ");
    for (const pair of questionAttrsPairs) {
      const questionAttr = pair.match(questionAttrPattern);
      question[questionAttr[1]] = questionAttr[2];
    }

    // Parse question text
    question.text = questionString.match(questionTextPattern)[1];

    // Parse question options
    const questionOptionsArray = questionString.match(questionOptionsPattern);
    if (question.format === "multiple_choice") {
      for (const [i, option] of questionOptionsArray.entries()) {
        const optionMatch = option.match(questionOptionPattern);
        question.options.push(optionMatch[2]);
        if (optionMatch[1] === "**") {
          question.answer = i; // set answer as index of option
        }
      }
    } else if (question.format === "true_false") {
      for (const option of questionOptionsArray) {
        const optionMatch = option.match(questionOptionPattern);
        if (optionMatch[1] === "**") {
          // conver to boolean
          question.answer = optionMatch[2].toLowerCase() === "true";
        }
      }
    }

    data.questions.push(question);
  }
  return data;
}

export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.registerOptions((opts, siteSettings) => {
    opts.features[
      "discourse_quiz_enabled"
    ] = !!siteSettings.discourse_quiz_enabled;
  });

  helper.allowList(["div.quiz"]);

  helper.registerPlugin((md) => {
    const features = md.options.discourse.features;
    if (features["discourse_quiz_enabled"]) {
      md.block.bbcode.ruler.push("quiz", quizRule);
    }
  });
}
