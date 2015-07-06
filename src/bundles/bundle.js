'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));

var db = new PouchDB('addresses');

function showAddresses() {
  db.allDocs({include_docs: true, descending: true}).then(function(result) {
    console.log(result);
    result.rows.forEach(function(address) {
      addToList(address.id);
    });
    var test2 = document.querySelectorAll('.delete-btn');
    console.log(test2);
    [].forEach.call(test2, function(el) {
      el.addEventListener('click', function(e) {
        console.log(this.parentElement.textContent);
      });
    });
  });
}

var addressForm = document.getElementById('server-address-input');
var addressList = document.getElementById('used-links');

var submitBtn = document.getElementById('submit-address');

submitBtn.addEventListener('click', function() {
  if (addressForm.value) {
    submitAddress(addressForm.value);
  }
});

function addToList (address) {
  var addressEl = document.createElement('a');
  var deleteText = '<span class="pull-text-right delete-btn"><a>delete</a></span>';
  addressEl.className = 'list-group-item';
  addressEl.innerHTML = address + deleteText;
  addressList.appendChild(addressEl);
}

function submitAddress (address) {
  db.putIfNotExists({_id: address}).then(function(result) {
    console.log(result);
  });
}

showAddresses();
