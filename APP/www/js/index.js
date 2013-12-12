/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        if(parentElement) {
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }

        console.log('Received Event: ' + id);
    },
    onContactSaveSuccess: function(contract) {
        console.log("Save success");
    },
    onContactSaveError: function(contact) {
        console.log("Save Failed");
    }
};

(function($){
    $(document).ready(function(){
        //Display user info
        $('body').on('db-schema-ready', function(){
            $("#username-container").text(appUser.username);
        });

        //Bind logout action
        $('#user-logout-button').click(function(e){
            e.preventDefault();
            appUser.doLogout();
        });

        //Side-menu toggle
        $('.toggle-side-menu').click(function(e){
            e.preventDefault();
            e.stopPropagation();

            //if sync in progress prevent menu display
            if( !($('body').hasClass('sync-in-progress')) ){
                $('body').toggleClass('side-menu-active');
            }
        });

        //Display mask while sync
        $('body').on('sync-start', function(){
            console.log("start");
            $('body').addClass('sync-in-progress');
        });

        //Hide mask when sync ended
        $('body').on('sync-end', function(){
            console.log("end");
            $('body').removeClass('sync-in-progress');
        });

        //Handle external links
        $('body').on('click', 'a', function(e){
            var $link = $(this);

            if($link.attr('target') === '_system'){
                e.preventDefault();
              

                window.open($link.attr('href'),'_system');
            }
        });

        //menu search
        $('body').on('submit', '#search-form', function(){
            var searchKey = $('input', $(this)).val();

            if(searchKey.length > 1){
                return true;
            } else {
                alert(i18n.strings["search-input-error"]);
                return false;
            }
        });
    })
})(jQuery);