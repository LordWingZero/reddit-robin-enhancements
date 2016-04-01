// ==UserScript==
// @name         reddit-robin-enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add useful features to Reddit Robin
// @author       You
// @match        https://www.reddit.com/robin/
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/1.1.7/jquery.linkify.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

// select the target node
var target = document.querySelector('#robinChatMessageList');
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation);        
        console.log($(mutation.addedNodes[0]));
        var comment = $(mutation.addedNodes[0]);
        var user = comment.children('.robin-message--from');
        var message = comment.children('.robin-message--message');
        var userName = user.text();        
        user.wrap('<a href="https://www.reddit.com/u/'+userName+'"></a>');        
        message.linkify();                
    });
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }
 
// pass in the target node, as well as the observer options
observer.observe(target, config);

