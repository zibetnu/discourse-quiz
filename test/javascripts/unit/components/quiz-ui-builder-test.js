import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | quiz-ui-builder', function(hooks) {
  setupTest(hooks);

  test('changeActive method changes activeQuestionIndex', function(assert) {
    let component = this.owner.factoryFor('component:modal/quiz-ui-builder').create({
        model: {
          activeQuestionIndex: 1,
          questions: [
            { format: "multiple_choice", text: "Question1", options: ["a", "b"], answer: 0, error: null },
            { format: "multiple_choice", text: "Question2", options: ["a", "b"], answer: 1, error: null }
          ]
        }
      });
  
    // Call the method you want to test
    component.changeActive(2); // Assuming changeActive is a method that updates activeQuestionIndex
  
    // Assert the expected result
    assert.equal(component.model.activeQuestionIndex, 2, 'Model active question index should be updated to 2');
  });
  
});
