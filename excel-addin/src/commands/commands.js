/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

/**
 * Displays validation dialog and handles message passing
 * @param event {Office.AddinCommands.Event}
 */
function startValidate(event) {
  const staticText = "This is a static text string."; // Your static text

  // Open the task pane
  Office.context.ui.displayDialogAsync(
    "https://vatoloco.net/contractsmarts/taskpane.html",
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

/**
 * Shows a notification when the add-in command is executed.
 * This is an outlook thing, we can possible delete it
 * @param event {Office.AddinCommands.Event}
 */
function action(event) {
  const message = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };

  // Show a notification message.
  Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);

  // Be sure to indicate when the add-in command function is complete.
  event.completed();
}

/**
 * Highlights a region of rows
 * @param event {Office.AddinCommands.Event}
 */
async function highlightSelection(event) {
  // Implement your custom code here. The following code is a simple Excel example.  
  try {
        await Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            range.format.fill.color = "yellow";
            await context.sync();
        });
    } catch (error) {
        // Note: In a production add-in, notify the user through your add-in's UI.
        console.error(error);
    }

  // Calling event.completed is required. event.completed lets the platform know that processing has completed.
  event.completed();
}

// Register all functions with Office
Office.actions.associate("startValidate", startValidate);
Office.actions.associate("action", action);
Office.actions.associate("highlightSelection", highlightSelection);