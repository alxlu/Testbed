'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
var _ = require('lodash');

var db = new PouchDB('addresses');

var addressForm = document.getElementById('server-address-input');
var addressList = document.getElementById('used-links');
var submitBtn = document.getElementById('submit-address');

(function () {
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
        toastHandler(args.argument, args.userInput.textReply);
      }
    });
  }
})();

function showAddresses() {
  db.allDocs({include_docs: true, descending: true}).then(function(result) {
    console.log(result);
    result.rows.forEach(function(address) {
      addToList(address.id);
    });
    var test2 = document.querySelectorAll('.delete-btn');
    console.log(test2);
    [].forEach.call(test2, function(el) {
      el.addEventListener('click', function() {
        var address = (this.parentElement
                  .querySelector('span[class="address"]')
                  .textContent);
        var that = this;
        db.get(address).then(function(doc) {
          db.remove(doc).then(function(result) {
            console.log(result);
            if (result.ok) {
              var listItem = that.parentElement;
              listItem.parentElement.removeChild(listItem);
            }
          }).catch(function(err) {
            console.log(err);
          });
        });
      });
    });
  });
}

submitBtn.addEventListener('click', function() {
  if (addressForm.value) {
    submitAddress(addressForm.value);
    addressForm.value = '';
  }
});

addressForm.addEventListener('keyup', function(e) {
  if (addressForm.value) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      submitAddress(addressForm.value);
      addressForm.value = '';
    }
  }
});

function addToList (address) {
  var addressEl = document.createElement('a');
  addressEl.className = 'list-group-item';
  var tplstr = '<span class="address"><a class="win-link" href="<%= address %>">' +
    '<%- address %></span></a>' +
    '<span class="pull-text-right delete-btn">' +
    '<a class="text-warning">delete</a></span>';
  var compiled = _.template(tplstr);
  addressEl.innerHTML = compiled({address: address});
  addressList.appendChild(addressEl);
}

function submitAddress (address) {
  db.putIfNotExists({_id: address}).then(function(result) {
    console.log(result);
    window.location.href = address;
  });
}

showAddresses();
