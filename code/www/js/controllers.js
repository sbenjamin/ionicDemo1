angular.module('songhop.controllers', ['ionic', 'songhop.services'])


FUCK 

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


//Tabs Controller
//Tabs Controller
//Tabs Controller
.controller('TabsCtrl', function($scope, User, Recommendations) {
    
    $scope.enteringFavorites = function(){
        Recommendations.haltAudio();
        User.newFavorites = 0;
    }
    
    $scope.leavingFavorites = function(){
        Recommendations.init();
    };
    
    $scope.favCount = User.favoriteCount;

})

//Splash Controller
//Splash Controller
//Splash Controller
.controller('splashCtrl',function($scope){
    

});














