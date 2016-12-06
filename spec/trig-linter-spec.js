'use babel';

import TrigLinter from '../lib/trig-linter';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('TrigLinter', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('trig-linter');
  });

  describe('when the trig-linter:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.trig-linter')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'trig-linter:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.trig-linter')).toExist();

        let trigLinterElement = workspaceElement.querySelector('.trig-linter');
        expect(trigLinterElement).toExist();

        let trigLinterPanel = atom.workspace.panelForItem(trigLinterElement);
        expect(trigLinterPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'trig-linter:toggle');
        expect(trigLinterPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.trig-linter')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'trig-linter:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let trigLinterElement = workspaceElement.querySelector('.trig-linter');
        expect(trigLinterElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'trig-linter:toggle');
        expect(trigLinterElement).not.toBeVisible();
      });
    });
  });
});
