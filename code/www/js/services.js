angular.module('songhop.services', ['ionic.utils'])
.factory('User',function($http, $q, $localstorage, SERVER){
    var o = {};
    o.favorites = [];
    o.session_d = false;
    o.username = false;
    o.newFavorites = 0;
    
    // attempt login or signup
    o.auth = function(username, signingUp) {

        var authRoute;

        if (signingUp) {
          authRoute = 'signup';
        } else {
          authRoute = 'login'
        }

       return $http.post(SERVER.url + '/' + authRoute, {username: username})
      .success(function(data){
        o.setSession(data.username, data.session_id, data.favorites);
      });
    }
    
    o.addSongToFavorites = function(song){
        if(!song)return false;
        
        o.favorites.unshift(song);
        o.newFavorites++;
        
        //persist the added song to the server.
        return $http.post(SERVER.url + '/favorites', {session_id: o.session_id, song_id: song.song_id});
    };
    
    o.removeSongFromFavorites = function(song,index){
        if(!song)return false;
        console.log('removeSongFromFavorites',song,index)
        o.favorites.splice(index,1);
    };
    
    o.favoriteCount = function(){
        return o.newFavorites;
    };
    
     // gets the entire list of this user's favs from server
  o.populateFavorites = function() {

    };
  
    
      // set session data
  o.setSession = function(username, session_id, favorites) {
    if (username) o.username = username;
    if (session_id) o.session_id = session_id;
    if (favorites) o.favorites = favorites;

    // set data in localstorage object
    $localstorage.setObject('user', { username: username, session_id: session_id });
  }
  
   // wipe out our session data
  o.destroySession = function() {
    $localstorage.setObject('user', {});
    o.username = false;
    o.session_id = false;
    o.favorites = [];
    o.newFavorites = 0;
  }
    
    
     // check if there's a user session present
  o.checkSession = function() {
    var defer = $q.defer();

    if (o.session_id) {
      // if this session is already initialized in the service
      defer.resolve(true);

    } else {
      // detect if there's a session in localstorage from previous use.
      // if it is, pull into our service
      var user = $localstorage.getObject('user');

      if (user.username) {
        // if there's a user, lets grab their favorites from the server
        o.setSession(user.username, user.session_id);
     

      } else {
        // no user info in localstorage, reject
        defer.resolve(false);
      }

    }

    return defer.promise;
  };
    
    return o;
})


.factory('Recommendations',function($http, $q, SERVER){
    var o = {};
    var media;
    
    o.queue = [];
    
    o.init = function(){
        // if there's nothing in the queue, fill it.
        // this also means that this is the first call of init.
        if(o.queue.length === 0){
            return o.getNextSongs();
        }
        else{
            // otherwise, play the current song
            return o.playCurrentSong();
        }
    };
    
    o.getNextSongs = function(){
        return $http({
            method : 'GET',
            url : SERVER.url + '/recommendations'
        }).success(function(data){
            o.queue = o.queue.concat(data);
        });
    }; //getNextSongs
    
    o.nextSong = function(){
        // pop the index 0 off
        o.queue.shift(); // remove the first item in the array.
        
        // low on the queue? let's fill it up
        if(o.queue.length <= 3){
            o.getNextSongs();
        }
        
        // end the song
        o.haltAudio();
        
        return o.queue[1].image_large;
    };
    
    o.playCurrentSong = function(){
        var defer = $q.defer();
        
        //play the current song's preview.
        media = new Audio(o.queue[0].preview_url);
        
        media.addEventListener("loadeddata", function(){
            defer.resolve();
        });
        
        media.play();
        
        return defer.promise;
    };
    
    o.haltAudio = function(){
        if(media) media.pause();
    };
    
    return o;
})