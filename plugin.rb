# frozen_string_literal: true

# name: discourse-quiz
# about: Add support for in-topic quizzes
# version: 0.0.1
# authors: Grayden Shand <graydenshand@gmail.com>
# url: https://github.com/graydenshand/discourse-quiz
# required_version: 2.7.0
# transpile_js: true

enabled_site_setting :discourse_quiz_enabled

# Register static assets
register_asset "stylesheets/common/quiz-ui-builder.scss"
register_asset "stylesheets/desktop/quiz-ui-builder.scss", :desktop
register_asset "stylesheets/common/quiz.scss"
register_svg_icon "graduation-cap" if respond_to?(:register_svg_icon)

after_initialize do
  # Register server assets
  %w[
    ../app/controllers/quizzes_controller.rb
    ../app/controllers/quiz_questions_controller.rb
    ../app/controllers/quiz_attempts_controller.rb
    ../app/models/quiz.rb
    ../app/models/quiz_attempt.rb
    ../app/models/quiz_question.rb
    ../app/models/quiz_question_response.rb
    ../app/serializers/quiz_attempt_serializer.rb
    ../app/serializers/quiz_serializer.rb
    ../app/serializers/quiz_question_serializer.rb
    ../lib/quiz_parser.rb
    ../lib/quiz_validator.rb
  ].each { |path| load File.expand_path(path, __FILE__) }

  # Create engine for custom routes
  module ::DiscourseQuiz
    class Engine < ::Rails::Engine
      engine_name "discourse-quiz"
      isolate_namespace DiscourseQuiz
    end
  end

  # Register custom routes
  DiscourseQuiz::Engine.routes.draw do
    get '/:quiz_id' => 'quizzes#show'
    put '/:quiz_id' => 'quizzes#update'
    get '/:quiz_id/attempts' => 'quiz_attempts#index'
    post '/:quiz_id/attempts' => 'quiz_attempts#create'
    put '/:quiz_id/attempts' => 'quiz_attempts#update'
    get '/:quiz_id/questions' => 'quiz_questions#index'
  end

  Discourse::Application.routes.append do
    mount ::DiscourseQuiz::Engine, at: '/quizzes/'
  end

  # Register quiz validator
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

  # Create/Update quiz when post is created/updated
  on(:post_process_cooked) do |doc, post|
    DiscourseQuiz::Quiz.sync_from_post(post)
  end

  # Extend post serializer with quiz data
  add_to_serializer(:post, :quiz) do
    DiscourseQuiz::QuizSerializer.new(
      object.quiz,
      scope: scope, root: false
    )
  end

  # Extend User
  add_to_class(:user, :can_create_quiz?) do
    if defined?(@can_create_quiz)
      return @can_create_quiz
    end
    @can_create_quiz = begin
      staff?
    rescue StandardError
      false
    end
  end

  add_to_class(:user, :can_act_on_quiz?) do |quiz|
    if defined?(@can_act_on_quiz)
      return @can_act_on_quiz
    end
    @can_act_on_quiz = begin
      return true if staff?
      can_create_quiz? && quiz.post.user_id == id
    rescue StandardError
      false
    end
  end

  # Extend Guardian
  add_to_class(:guardian, :can_act_on_quiz?) do |quiz|
    user && user.can_act_on_quiz?(quiz)
  end
end
