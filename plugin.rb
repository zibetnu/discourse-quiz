# frozen_string_literal: true

# name: discourse-quiz
# about: Add support for quizzes
# version: 0.0.1
# authors: Grayden Shand <graydenshand@gmail.com>
# url: https://github.com/graydenshand/discourse-quiz
# required_version: 2.7.0
# transpile_js: true

enabled_site_setting :discourse_quiz_enabled

register_asset "stylesheets/common/quiz-ui-builder.scss"
register_asset "stylesheets/desktop/quiz-ui-builder.scss", :desktop
register_asset "stylesheets/common/quiz.scss"

after_initialize do
  %w[
    ../app/models/quiz.rb
    ../app/models/quiz_attempt.rb
    ../app/models/quiz_option.rb
    ../app/models/quiz_question.rb
    ../app/models/quiz_question_response.rb
  ].each { |path| load File.expand_path(path, __FILE__) }
end
