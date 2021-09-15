# frozen_string_literal: true

# name: discourse-quiz
# about: Add support for in-topic quizzes
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
    ../app/models/quiz_question.rb
    ../app/models/quiz_question_response.rb
    ../lib/quiz_parser.rb
    ../lib/quiz_validator.rb
  ].each { |path| load File.expand_path(path, __FILE__) }

  reloadable_patch do
    Post.class_eval do
      has_one :quiz, dependent: :destroy, class_name: "DiscourseQuiz::Quiz"

      validate :valid_quiz
      def valid_quiz
        return unless self.raw_changed?
        validator = DiscourseQuiz::QuizValidator.new(self)
        validator.validate_quiz
      end
    end
  end

  on(:post_process_cooked) do |doc, post|
    DiscourseQuiz::Quiz.upsert_from_post(post)
  end
end
