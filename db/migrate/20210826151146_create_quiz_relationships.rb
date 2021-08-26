# frozen_string_literal: true
class CreateQuizRelationships < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!
  def up
    execute <<~SQL
      ALTER TABLE quizzes
      ADD COLUMN IF NOT EXISTS post_id BIGINT REFERENCES posts(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quizzes_on_post_id ON quizzes USING BTREE (post_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_questions
      ADD COLUMN IF NOT EXISTS quiz_id BIGINT REFERENCES quizzes(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_questions_on_quiz_id ON quiz_questions USING BTREE (quiz_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_options
      ADD COLUMN IF NOT EXISTS quiz_question_id BIGINT REFERENCES quiz_questions(id)
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_options_on_quiz_question_id ON quiz_options USING BTREE (quiz_question_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_questions
      ADD COLUMN IF NOT EXISTS correct_option_id BIGINT REFERENCES quiz_options(id)
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_questions_on_correct_option_id ON quiz_questions USING BTREE (correct_option_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_attempts
      ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_attempts_on_user_id ON quiz_attempts USING BTREE (user_id)#{' '}
    SQL

    execute <<~SQL
      ALTER TABLE quiz_attempts
      ADD COLUMN IF NOT EXISTS quiz_id BIGINT REFERENCES quizzes(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_attempts_on_quiz_id ON quiz_attempts USING BTREE (quiz_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_question_responses
      ADD COLUMN IF NOT EXISTS quiz_attempt_id BIGINT REFERENCES quiz_attempts(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_question_responses_on_quiz_attempt_id ON quiz_question_responses USING BTREE (quiz_attempt_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_question_responses
      ADD COLUMN IF NOT EXISTS quiz_question_id BIGINT REFERENCES quiz_attempts(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_question_responses_on_quiz_question_id ON quiz_question_responses USING BTREE (quiz_question_id)
    SQL

    execute <<~SQL
      ALTER TABLE quiz_question_responses
      ADD COLUMN IF NOT EXISTS quiz_option_id BIGINT REFERENCES quiz_attempts(id) NOT NULL
    SQL

    execute <<~SQL
      CREATE INDEX CONCURRENTLY IF NOT EXISTS
      index_quiz_question_responses_on_quiz_option_id ON quiz_question_responses USING BTREE (quiz_option_id)
    SQL
  end

  def down
    remove_column :quiz_question_responses, :quiz_option_id
    remove_column :quiz_question_responses, :quiz_question_id
    remove_column :quiz_question_responses, :quiz_attempt_id
    remove_column :quiz_attempts, :quiz_id
    remove_column :quiz_attempts, :user_id
    remove_column :quiz_questions, :correct_option_id
    remove_column :quiz_options, :quiz_question_id
    remove_column :quiz_questions, :quiz_id
    remove_column :quizzes, :post_id

  end
end
