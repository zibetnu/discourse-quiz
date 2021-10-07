const quizRule = {
  tag: "quiz",

  replace: function (state) {
    // Replace with an empty div, allow widget to handle the rest
    let token = state.push("div_open", "div", 1);
    token.attrs = [["class", "quiz"]];
    state.push("div_close", "div", -1);
    return true;
  },
};

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
