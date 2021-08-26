# frozen_string_literal: true

# name: discourse-quiz
# about: Add support for quizzes
# version: 0.0.1
# authors: Grayden Shand <graydenshand@gmail.com>
# url: https://github.com/graydenshand/discourse-quiz
# required_version: 2.7.0
# transpile_js: true

enabled_site_setting :discourse_quiz_enabled

after_initialize do
  %w[
    ../app/models/quiz.rb
    ../app/models/quiz_attempt.rb
    ../app/models/quiz_option.rb
    ../app/models/quiz_question.rb
    ../app/models/quiz_question_response.rb
  ].each { |path| load File.expand_path(path, __FILE__) }

  # Create "True" and "False" options with ids 1 and 2.
  if !QuizOption.where(id: 1).exists?
    true_option = QuizOption.new
    true_option.text = "True"
    true_option.position = 0
    true_option.save
  end
  if !QuizOption.where(id: 2).exists?
    true_option = QuizOption.new
    true_option.text = "False"
    true_option.position = 1
    true_option.save
  end
end
