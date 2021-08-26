# frozen_string_literal: true

require 'rails_helper'

require_relative '../fabricators/quiz_attempt_fabricator'
require_relative '../fabricators/quiz_fabricator'
require_relative '../fabricators/quiz_option_fabricator'
require_relative '../fabricators/quiz_question_fabricator'
require_relative '../fabricators/quiz_question_response_fabricator'

describe QuizQuestionResponse do
  describe "validate" do
    it "fails validation for invalid multiple choice answer" do
      quiz = Fabricate(:quiz)
    question = Fabricate(:quiz_question, quiz: quiz)
    option = question.quiz_options.create(text: "Option 1", position: 1)

    # Expect default question format to be multiple_choice
    expect(question.format).to eq("multiple_choice")

    user = Fabricate(:user)
    quiz_attempt = Fabricate(:quiz_attempt, user: user, quiz: quiz)

    # Expect an error when creating response with an invalid answer
    expect {
      Fabricate(:quiz_question_response, quiz_question: question, quiz_attempt: quiz_attempt, answer: 50)
    }.to raise_error(ActiveRecord::RecordInvalid)

    # Expect validation to pass when given a valid answer
    response = Fabricate(:quiz_question_response, quiz_question: question, quiz_attempt: quiz_attempt, answer: option.id)
    expect(response.id).to_not eq(nil)
    expect(response.valid?).to eq(true)
    end

    it "fails validation for invalid true/false answer" do
      quiz = Fabricate(:quiz)
    question = Fabricate(:quiz_question, quiz: quiz, format: "true_false")
    user = Fabricate(:user)
    quiz_attempt = Fabricate(:quiz_attempt, user: user, quiz: quiz)

    # Expect an error when creating response with an invalid answer
    expect {
      Fabricate(:quiz_question_response, quiz_question: question, quiz_attempt: quiz_attempt, answer: 5)
    }.to raise_error(ActiveRecord::RecordInvalid)

    # Expect validation to pass when given a valid answer
    response = Fabricate(:quiz_question_response, quiz_question: question, quiz_attempt: quiz_attempt, answer: true)
    expect(response.id).to_not eq(nil)
    expect(response.valid?).to eq(true)
    end
  end
end
