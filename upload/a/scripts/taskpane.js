Office.onReady()
    .then(function() {
        console.log("Office is ready. Task pane functions are now available.");

        // Set up the function to receive and display the static text
        Office.context.ui.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
            const displayTextArea = document.getElementById("displayTextArea");
            displayTextArea.value = args.message; // Display the static text in the textarea
        });
    })
    .catch(function(error) {
        console.error("Error initializing Office add-in in task pane:", error);
});