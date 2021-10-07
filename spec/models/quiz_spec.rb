# frozen_string_literal: true

require 'rails_helper'
require_relative "../SAMPLE_QUIZ.rb"

altered_quiz = <<QUIZ
This is a quiz
[quiz]
[question format="true_false"]
Python uses semi-colons as a statement delimiter.
* True
** False
[/question]
[/quiz]

This is a poll
[poll type=regular results=always chartType=bar]
* Option 1
* Option 2
[/poll]
QUIZ
# >>

describe DiscourseQuiz::Quiz do
  describe "upsert_from_post" do
    it "creates quiz from post" do
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.upsert_from_post(post)
      expect(quiz.id).to_not eq(nil)
      expect(post.quiz.id).to eq(quiz.id)
      expect(quiz.questions.length).to eq(3)
    end

    it "updates quiz from edited post" do
      # Create a quiz
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.upsert_from_post(post)
      expect(quiz.id).to_not eq(nil)
      expect(post.quiz.id).to eq(quiz.id)
      expect(quiz.questions.length).to eq(3)

      # Edit the post body
      post.update(raw: altered_quiz)
      quiz2 = DiscourseQuiz::Quiz.upsert_from_post(post)
      expect(quiz2.id).to eq(quiz.id)
      expect(quiz2.questions.length).to eq(1)
      questions = DiscourseQuiz::QuizQuestion.where(quiz_id: quiz.id)
      expect(questions.length).to eq(1)
    end
  end
end
