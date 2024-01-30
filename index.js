/*global YT */
/*jslint browser:true */
/*jslint devel: true */

/*
 * SETUP
 */

addYoutubeScriptTagToHTML();

const myModal = document.querySelector("#myModal");
myModal.addEventListener("click", handleOnModalClick);

const ALL_PLAYERS = [];

/*
 * EVENT HANDLERS
 */

// This function is automatically called by the YT Player API
// after downloading.
function onYouTubeIframeAPIReady() {
  // Load default video
  const defaultVideo = {
    selector: "ytplayer0",
    options: {
      playerVars: {
        loop: 1,
        playlist: "s24NT7TFkUw"
      }
    }
  };

  const parent = document.getElementById(defaultVideo.selector).parentElement;
  createPlayer(parent, defaultVideo.options);
}

function handleOnModalClick() {
  if (ALL_PLAYERS) {
    ALL_PLAYERS[0].destroy();
    // you have to remove the player from our global list now
    ALL_PLAYERS.shift() // this removes first item
  }

  console.log("hit");
  myModal.classList.remove("open");

  const videosToAddAfterModalClick = [
    {
      selector: "ytplayer5",
      options: {}
    },
    {
      selector: "ytplayer3",
      options: {}
    },
    {
      selector: "ytplayer2",
      options: {}
    },
    {
      selector: "ytplayer1",
      options: {
        videoId: "CHahce95B1g"
      }
    },
    {
      selector: "ytplayer4",
      options: {
        playerVars: {
          playlist: "0dgNc5S8cLI,mnfmQe8Mv1g,-Xgi_way56U,CHahce95B1g"
        }
      }
    },
  ];

  videosToAddAfterModalClick.forEach(video => {
    const parent = document.getElementById(video.selector).parentElement;
    createPlayer(parent, video.options);
  });
}

function handleOnPlayerReady(event) {
  const player = event.target;
  player.setVolume(100);
  if (ALL_PLAYERS.length && player.id === ALL_PLAYERS[0].id) {
    shufflePlaylist(player);
  }
}

function handleOnPlayerStateChange(event) {
  const player = event.target;

  if (event.data === YT.PlayerState.PLAYING) {
    ALL_PLAYERS.forEach((existingPlayer) => {
      // Have to check by id.
      // Can't compare objects like you were trying to do
      if (existingPlayer.id !== player.id) {
        // Don't just blindly try to pause.
        // First make sure the vid is even playing.
        if (existingPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
          existingPlayer.pauseVideo();
          console.log("pause");
        }
      }
    });
  }
}

/*
 * MISC FUNCTIONS
 */

function shufflePlaylist(player) {
  player.setShuffle(true);
  player.playVideoAt(0);
  player.stopVideo();
}

function combinePlayerOptions(opts1 = {}, opts2 = {}) {
  const combined = Object.assign({}, opts1, opts2);
  Object.keys(opts1).forEach(function checkObjects(prop) {
    if (typeof opts1[prop] === "object") {
      combined[prop] = Object.assign({}, opts1[prop], opts2[prop]);
    }
  });
  return combined;
}

function createPlayer(videoWrapper, playerOptions = {}) {
  const defaultPlayerOptions = {
    height: 360,
    host: "https://www.youtube-nocookie.com",
    playerVars: {
      autoplay: 0,
      controls: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3
      //playlist: 1
    },
    width: 640
  }

  const video = videoWrapper.querySelector(".video");
  const options = combinePlayerOptions(defaultPlayerOptions, playerOptions);

  options.videoId = options.videoId || video.dataset.id;
  options.events = options.events || {};
  options.events.onReady = handleOnPlayerReady;
  options.events.onStateChange = handleOnPlayerStateChange;

  return ALL_PLAYERS.push(new YT.Player(video, options));

  //return addPlayer_fromMakeVideoPlayer(video, options);
}

function addYoutubeScriptTagToHTML () {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/player_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}