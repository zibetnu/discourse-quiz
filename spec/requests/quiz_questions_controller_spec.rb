# frozen_string_literal: true

require 'rails_helper'
require_relative "../sample_quiz.rb"
require_relative "../fabricators/quiz_fabricator.rb"

describe DiscourseQuiz::QuizQuestionsController do
  describe "#index" do
    it "returns unauthorized response" do
      quiz = Fabricate(:quiz)
      get "/quizzes/#{quiz.id}/questions.json"
      expect(response.status).to eq(403)
    end
    it "returns successful response for staff, with answers included" do
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.sync_from_post(post)
      user = Fabricate(:user, admin: true)
      sign_in(user)
      get "/quizzes/#{quiz.id}/questions.json"
      expect(response.status).to eq(200)
      expect(response.parsed_body['quiz_questions'][0].key?("answer")).to eq(true)
    end
    it "returns successful response if open, with answers hidden" do
      post = Fabricate(:post, raw: SAMPLE_QUIZ)
      quiz = DiscourseQuiz::Quiz.sync_from_post(post)
      quiz.is_open = true
      quiz.save!
      get "/quizzes/#{quiz.id}/questions.json"
      expect(response.status).to eq(200)
      expect(response.parsed_body['quiz_questions'].length).to eq(3)
      expect(response.parsed_body['quiz_questions'].first.key?("answer")).to eq(false)
    end
  end
end
