# frozen_string_literal: true

require 'rails_helper'
require_relative "../sample_quiz.rb"

edited_raw = <<QUIZ
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

deleted_raw = <<QUIZ
This is a poll
[poll type=regular results=always chartType=bar]
* Option 1
* Option 2
[/poll]
QUIZ
# >>

describe DiscourseQuiz::Quiz do
  describe "sync_from_post" do
    it "creates quiz from post" do
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.sync_from_post(post)
      expect(quiz.id).to_not eq(nil)
      expect(post.quiz.id).to eq(quiz.id)
      expect(quiz.questions.length).to eq(3)
    end

    it "updates quiz from edited post" do
      # Create a quiz
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.sync_from_post(post)
      expect(quiz.id).to_not eq(nil)
      expect(post.quiz.id).to eq(quiz.id)
      expect(quiz.questions.length).to eq(3)

      # Edit the post body
      post.update(raw: edited_raw)
      quiz2 = DiscourseQuiz::Quiz.sync_from_post(post)
      expect(quiz2.id).to eq(quiz.id)
      expect(quiz2.questions.length).to eq(1)
      questions = DiscourseQuiz::QuizQuestion.where(quiz_id: quiz.id)
      expect(questions.length).to eq(1)
    end

    it "deletes quiz when quiz has been removed from post" do
      # Create a quiz
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.sync_from_post(post)
      expect(quiz.id).to_not eq(nil)
      expect(post.quiz.id).to eq(quiz.id)
      expect(quiz.questions.length).to eq(3)

      # Edit the post body (removing the quiz)
      post.update(raw: deleted_raw)
      expect(DiscourseQuiz::Quiz.sync_from_post(post)).to eq(nil)
      expect { DiscourseQuiz::Quiz.find(quiz.id) }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
