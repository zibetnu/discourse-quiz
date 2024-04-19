> [!WARNING]
> This plugin is in early development. It is not ready for general use.

# Discourse Quiz

The discourse-quiz plugin adds support for quizzes to your Discourse site.

A quiz is similar to a poll, but with multiple questions and correct answers.

Quizzes also optionally support time limits, and repeat attempts.

It’s intended for the following uses:

- Educators who use Discourse as a student portal for their course. Staff members can export the results of quizzes to import into their gradebooks.
- Special interest communities looking to create a fun challenge to test the knowledge of your community members: e.g. “Take this quiz to see how much you really know about XXXXXX”.

At least for version 1, it will only support multiple choice and True/False questions. This allows the quiz to be immediately scored without input from a staff member.

## Linting

To run linting locally, call the following 4 commands:

```
rubocop .
prettier -w .
yarn eslint --ext .js,.js.es6 --no-error-on-unmatched-pattern {test,assets}/javascripts
yarn ember-template-lint assets/javascripts
```
