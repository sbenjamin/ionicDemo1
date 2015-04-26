angular.module('songhop.controllers', ['ionic', 'songhop.services'])


//Discover Controller
//Discover Controller
//Discover Controller
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {
    console.log('DiscoverCtrl');
    
    
    var showLoading = function(){
        $ionicLoading.show({
            template : '<i class="ion-loading-c"></i>',
            noBackdrop : false
        });
    };
    
    var hideLoading = function(){
        $ionicLoading.hide();
    };
    
    // set loading to true first time while we retrieve songs from server.
    showLoading();
    
    
    Recommendations.getNextSongs().then(function(){
        $scope.currentSong = Recommendations.queue[0];
    });
    
    //sendFeedback
    $scope.sendFeedback = function(bool){
        console.log('sendFeedback:', bool);
        
        if(bool){
            User.addSongToFavorites($scope.currentSong);
        }
        
        $scope.currentSong.rated = bool;
        $scope.currentSong.hide = true;
     
        $scope.nextImage = Recommendations.nextSong();
        console.log('nextImage',$scope.nextImage);
        
        $timeout(function(){
            $scope.currentSong = Recommendations.queue[0];
            $scope.currentSong.loaded = false;
        },250);
        
        Recommendations.playCurrentSong().then(function(){
            $scope.currentSong.loaded = true;
        });
    };

    $scope.nextAlbumImg = function(){
        console.log('nextAlbumImg');
        if(Recommendations.queue.length > 1){
            return Recommendations.queue[1].image_large;
        }
        return '';
    };
    
    Recommendations.init().then(function(){
        $scope.currentSong = Recommendations.queue[0];
        return Recommendations.playCurrentSong();
    }).then(function(){
        hideLoading();
        $scope.currentSong.loaded = true;
    });
    
})


//Favorites Controller
//Favorites Controller
//Favorites Controller
.controller('FavoritesCtrl', function($scope, $window, User) {
    $scope.favorites = User.favorites;
     
    $scope.removeSong = function(song,index){
        User.removeSongFromFavorites(song,index);
    };
    
    $scope.openSong = function(song){
        $window.open(song.open_url,"_system")
    };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, $window, User, Recommendations) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

  // method to reset new favorites to 0 when we click the fav tab
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

  $scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = '/';
  }

})

//Splash Controller
//Splash Controller
//Splash Controller
.controller('TabsCtrl', function($scope, $window, User, Recommendations) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

  // method to reset new favorites to 0 when we click the fav tab
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

  $scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = '/';
  }

})














