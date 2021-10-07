import DiscourseQuizAdapter from "./discourse-quiz-adapter";
export default DiscourseQuizAdapter.extend({
  pathFor(store, type, findArgs) {
    /*
      /quizzes/<quiz_id>/attempts
    */
    const quiz_id = findArgs["quiz_id"];
    delete findArgs["quiz_id"];

    const id = findArgs["id"];
    delete findArgs["id"];

    let path = this.basePath(store, type, {}) + quiz_id + "/attempts";

    if (id) {
      path += `/${id}`;
    }

    return this.appendQueryParams(path, findArgs);
  },
});
