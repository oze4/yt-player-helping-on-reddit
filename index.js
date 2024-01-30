/*global YT */
/*jslint browser:true */
/*jslint devel: true */
const myModal = document.querySelector("#myModal");
myModal.addEventListener("click", modalClickHandler);

const ALL_PLAYERS = [];
const VIDEO_PLAYER = makeVideoPlayer();
const MANAGE_PLAYER = makeManagePlayer();
const LOAD_PLAYER = uiLoadPlayer();

function modalClickHandler() {
  if (ALL_PLAYERS) {
    ALL_PLAYERS[0].destroy();
    // you have to remove the player from our global list now
    ALL_PLAYERS.shift() // this removes first item
  }
  console.log("hit");
  myModal.classList.remove("open");
}

function makeVideoPlayer() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/player_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onPlayerReady(event) {
    const player = event.target;
    player.setVolume(100);
    if (ALL_PLAYERS.length && player.id === ALL_PLAYERS[0].id) {
      shufflePlaylist(player);
    }
  }

  function shufflePlaylist(player) {
    player.setShuffle(true);
    player.playVideoAt(0);
    player.stopVideo();
  }

  function onPlayerStateChange(event) {
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

  function addPlayer(video, playerOptions) {
    playerOptions.videoId = playerOptions.videoId || video.dataset.id;
    playerOptions.events = playerOptions.events || {};
    playerOptions.events.onReady = onPlayerReady;
    playerOptions.events.onStateChange = onPlayerStateChange;

    ALL_PLAYERS.push(new YT.Player(video, playerOptions));
    //players.push(player); // Add new player to players array
    //return player;
  }

  return {
    addPlayer
  };
}

function makeManagePlayer() {
  const playerVars = {
    autoplay: 0,
    controls: 1,
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3
    //playlist: 1
  };

  const defaults = {
    height: 360,
    host: "https://www.youtube-nocookie.com",
    playerVars,
    width: 640
  };

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
    const video = videoWrapper.querySelector(".video");
    const options = combinePlayerOptions(defaults, playerOptions);
    return VIDEO_PLAYER.addPlayer(video, options);
  }

  function playerAdder(parent, playerOptions) {
    const wrapper = parent;
    return function () {
      initPlayer(wrapper, playerOptions);
    };
  }

  function initPlayer(wrapper, playerOptions) {
    createPlayer(wrapper, playerOptions);
  }

  return {
    adder: playerAdder
  };
}

function uiLoadPlayer() {
  function addPlayer(playerSelector, playerOptions) {
    const parent = document.getElementById(playerSelector).parentElement;
    const callback = MANAGE_PLAYER.adder(parent, playerOptions);
    callback();
  }

  return {
    add: addPlayer
  };
}

function onYouTubeIframeAPIReady() {
  LOAD_PLAYER.add("ytplayer0", {
    playerVars: {
      loop: 1,
      playlist: "s24NT7TFkUw"
    }
  });
  const myModal = document.querySelector("#myModal");
  myModal.addEventListener("click", function () {

    LOAD_PLAYER.add("ytplayer1", {
      videoId: "CHahce95B1g"
    });
    LOAD_PLAYER.add("ytplayer2", {});
    LOAD_PLAYER.add("ytplayer3", {});
    LOAD_PLAYER.add("ytplayer4", {
      playerVars: {
        playlist: "0dgNc5S8cLI,mnfmQe8Mv1g,-Xgi_way56U,CHahce95B1g"
      }
    });
    LOAD_PLAYER.add("ytplayer5", {});
  });
}