// ==UserScript==
// @name         reddit-robin-enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add useful features to Reddit Robin
// @author       You
// @match        https://www.reddit.com/robin/
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/1.1.7/jquery.linkify.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
/* jshint -W097 */
'use strict';

// select the target node
var target = document.querySelector('#robinChatMessageList');
var messageList = $('#robinChatMessageList');
var userList = $('#robinUserList'); 

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var comment = $(mutation.addedNodes[0]);
        var user = comment.children('.robin-message--from');
        var message = comment.children('.robin-message--message');
        var userName = user.text();        
        user.wrap('<a href="https://www.reddit.com/u/'+userName+'"></a>');        
        message.linkify();
        
        if(GM_getValue("ignoring") !== null){
            var ignoringCurrently = GM_getValue("ignoring").split('|');
            var hits = ignoringCurrently.filter(function(ignoringUsername){
                return ignoringUsername === userName;
            });
            if(hits.length > 0){
                comment.remove();
                console.log('Just ignored a message from ' + hits[0]);
            }                        
        }
        
        if(message.text().indexOf('!ignore ') > -1 && r.config.logged === userName){
            var targetUser = message.text().split(' ')[1];
            var ignoringCurrently = GM_getValue("ignoring");
            ignoringCurrently += "|" + targetUser;            
            GM_setValue("ignoring", ignoringCurrently);
            messageList.append(getRobinMessage('Ignoring ' + targetUser));
        }

        if(message.text().indexOf('!clearignore') > -1 && r.config.logged === userName){       
            GM_setValue("ignoring", null);
            messageList.append(getRobinMessage('Ignore list emptied.'));
        }

        if(message.text().indexOf('!unignore ') > -1 && r.config.logged === userName){   
            if(GM_getValue("ignoring") !== null){
                var targetUser = message.text().split(' ')[1];
                var ignoringCurrently = GM_getValue("ignoring").split('|');
                var hits = ignoringCurrently.filter(function(ignoringUsername){
                    return ignoringUsername !== targetUser;
                });
                GM_setValue("ignoring", hits.join('|'));                
                messageList.append(getRobinMessage('Removed ' + targetUser + ' from ignore list.'));
            } else {
                messageList.append(getRobinMessage('Ignore list empty.'));
            }
        }
        
    });       
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }
 
// pass in the target node, as well as the observer options
observer.observe(target, config);

// Ignore
var users = userList.children('.robin-room-participant');


// Build robin message
function getRobinMessage(text){
    return $([
        '<div class="robin-message robin-message--display-compact robin--flair-class--no-flair robin--message-class--message robin--user-class--system">',
        '<time class="robin-message--timestamp" datetime="' + new Date().toString() + '">' + new Date().toString() + '</time>',
        '<span class="robin-message--message">'+text+'</span>',
        '</div>'
    ].join(''));                          
}

// Advertise
// TODO: r.robin.models how to use robinMessage?
// setTimeout(function(){
//    if(Math.random() < 0.2)
//    {
//        sendMessage("[reddit-robin-enhancements 0.2] https://redd.it/4cxlyz");
//    }
//}, 5000);

