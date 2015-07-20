'use strict';
var activationListener = function () {
  // Add the event listener to handle Windows activated event
  if (typeof Windows !== 'undefined' &&
      typeof Windows.UI !== 'undefined' &&
        typeof Windows.UI.WebUI !== 'undefined') {
    Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {
      var activation = Windows.ApplicationModel.Activation;

      // Handle applcation launch from the Windows OS
      if (args.kind === activation.ActivationKind.launch) {
        // Check if there are launch args
        if(args.arguments) {
          var launchArgs = JSON.parse(args.arguments);

          if (launchArgs.type === 'toast') {
            // The app has been launched from the click of a notification
            console.log(args);
          }
        }
      }
      // Handle user interaction from toast notification on Windows
      else if (args.kind === activation.ActivationKind.toastNotification) {
        //toastHandler(args.argument, args.userInput.textReply);
      }
    });
  }
};

module.exports = activationListener;
