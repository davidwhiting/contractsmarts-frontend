/* global console, document, Excel, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    // Initialize UI elements
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    
    // Set up message handler for dialog communication
    Office.context.ui.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
      const displayTextArea = document.getElementById("displayTextArea");
      if (displayTextArea) {
        displayTextArea.value = args.message; // Display the static text in the textarea
      }
    });
  }
}).catch(function(error) {
  console.error("Error initializing Office add-in in task pane:", error);
});