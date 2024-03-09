class DiscourseQuiz::QuizQuestionResponseSerializer < ApplicationSerializer
  attributes :answer,
             :quiz_attempt_id,
             :quiz_question_id
end