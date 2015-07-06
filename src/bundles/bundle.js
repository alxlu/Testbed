'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
var _ = require('lodash');

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
  addressEl.className = 'list-group-item';
  var tplstr = '<span class="address"><%- address %></span>' +
    '<span class="pull-text-right delete-btn">delete</span>';
  var compiled = _.template(tplstr);
  addressEl.innerHTML = compiled({address: address});
  addressList.appendChild(addressEl);
}

function submitAddress (address) {
  db.putIfNotExists({_id: address}).then(function(result) {
    console.log(result);
  });
}

showAddresses();
