import DiscourseQuizAdapter from "./discourse-quiz-adapter";

export default DiscourseQuizAdapter.extend({
  /*
    quizzes/attempts/question_responses
  */
  pathFor(store, type, findArgs) {
    let path = this.basePath(store, type, {}) + "/attempts/question_responses";

    return this.appendQueryParams(path, findArgs);
  },

  apiNameFor() {
    return "quiz-question-response";
  },
});