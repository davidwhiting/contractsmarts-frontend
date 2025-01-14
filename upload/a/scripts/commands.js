function startValidate(event) {
  const staticText = "This is a static text string."; // Your static text

  // Open the task pane
  Office.context.ui.displayDialogAsync(
    "https://api.contractsmarts.ai/static/a/taskpane.html",
    { height: 50, width: 30, displayInIframe: true },
    (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        console.error("Failed to open task pane:", asyncResult.error.message);
      } else {
        const dialog = asyncResult.value;

        // Send the static text message to the task pane
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, () => {
          dialog.messageParent(staticText);
        });
      }
    }
  );
  // Notify that the action is completed
  event.completed();
}