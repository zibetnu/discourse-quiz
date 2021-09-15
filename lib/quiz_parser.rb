# frozen_string_literal: true

# Define regex patterns
QUIZ_PATTERN = /\[quiz[\s\S]*?\[\/quiz\]/
QUESTION_PATTERN = /\[question .*?\][\s\S]*?\[\/question\]/ # Get all questions in quiz
QUESTION_ATTRS_PATTERN = /\[question (.*?)\]/ # Get all question attributes
QUESTION_ATTR_PATTERN = /(\w+)="(\w+)"/ # Extract attribute info for individual attribute
QUESTION_TEXT_PATTERN = /\[question .*\]\s([\s\S]*?)\n\*/ # Extract question text
QUESTION_OPTIONS_PATTERN = /\*+ .*/ # Get all options for a given question
QUESTION_OPTION_PATTERN = /(\*+?) (\w*)/ # Extract option info for individual option

module DiscourseQuiz
  class QuizParser
    def self.extract_quizzes(post)
      # Extract a quiz from a post
      quizzes = []
      if post.raw.match?(QUIZ_PATTERN)
        for quiz in post.raw.scan(QUIZ_PATTERN)
          quiz_data = {
            questions: []
          }
          questions = quiz.scan(QUESTION_PATTERN)
          questions.each do |question|
            question_data = {
              text: nil,
              options: [],
              answer: nil,
              format: nil
            }

            # Parse question attributes
            attributes = question.scan(QUESTION_ATTRS_PATTERN)
            attributes.each do |attribute|
              key, val, full = attribute[0].match(QUESTION_ATTR_PATTERN).captures
              question_data[key.to_sym] = val
            end

            # Parse question text
            question_text = question.match(QUESTION_TEXT_PATTERN)
            question_data[:text] = question_text[1]

            # Parse question options
            options = question.scan(QUESTION_OPTIONS_PATTERN)
            if question_data[:format] == "multiple_choice"
              options.each_with_index do |option, index|
                mark, option_text = option.match(QUESTION_OPTION_PATTERN).captures
                question_data[:options].append(option_text)
                if mark == "**"
                  question_data[:answer] = index
                end
              end
            elsif question_data[:format] == "true_false"
              options.each_with_index do |option, index|
                mark, option_text = option.match(QUESTION_OPTION_PATTERN).captures
                if mark == "**"
                  question_data[:answer] = option_text.downcase == "true"
                end
              end
            end
            quiz_data[:questions].append(question_data)
          end
          quizzes.append(quiz_data)
        end
      end
      quizzes
    end
  end
end
