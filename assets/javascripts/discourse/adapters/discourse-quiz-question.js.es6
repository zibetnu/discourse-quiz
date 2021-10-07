import DiscourseQuizAdapter from "./discourse-quiz-adapter";

export default DiscourseQuizAdapter.extend({
  /*
    /quizzes/<quiz_id>/questions
  */
  pathFor(store, type, findArgs) {
    const quiz_id = findArgs["quiz_id"];
    delete findArgs["quiz_id"];

    let path = this.basePath(store, type, findArgs);
    if (quiz_id) {
      path += `/${quiz_id}/questions`;
    }
    return this.appendQueryParams(path, findArgs) + ".json";
  },

  apiNameFor() {
    return "quiz-question";
  },
});
