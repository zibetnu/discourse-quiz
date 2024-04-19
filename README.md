> [!WARNING]
> This plugin is in early development. It is not ready for general use.

# Discourse Quiz

Add quizzes to your Discourse site.

A quiz is similar to a poll, but with multiple questions and correct answers.

## Features

- Multiple-choice questions
- True/false questions
- Repeat attempts

## Planned Features

- Optional time limits
- Attempt summaries
- Previewing

## Linting

To run linting locally, call the following 4 commands:

```
rubocop .
prettier -w .
yarn eslint --ext .js,.js.es6 --no-error-on-unmatched-pattern {test,assets}/javascripts
yarn ember-template-lint assets/javascripts
```
