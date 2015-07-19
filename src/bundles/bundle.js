'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
var _ = require('lodash');

var activationListener = require('activationListener');
var sysBackButton = require('sysBackButton');

activationListener();
sysBackButton();

var db = new PouchDB('addresses');

var addressForm = document.getElementById('server-address-input');
var addressList = document.getElementById('used-links');
var submitBtn = document.getElementById('submit-address');

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
