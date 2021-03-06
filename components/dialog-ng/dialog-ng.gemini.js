/* global gemini: false */

gemini.suite('Dialog Ng', () => {
  gemini.suite('dialog', child => {
    child.
      setUrl('/dialog-ng/dialog-ng.html').
      setCaptureElements(['*[data-test=ring-dialog]', '.ring-error-bubble']).
      capture('dialog');
  });

  gemini.suite('dialog with custom fooler', child => {
    child.
      setUrl('/dialog-ng/dialog-ng-with-overridden-footer.html').
      setCaptureElements(['*[data-test=ring-dialog]']).
      capture('dialog with custom footer');
  });
});
