/*global YT */
/*jslint browser:true */
/*jslint devel: true */
const myModal = document.querySelector("#myModal");
myModal.addEventListener("click", modalClickHandler);

const players = [];
const videoPlayer = makeVideoPlayer();
const managePlayer = makeManagePlayer();
const loadPlayer = uiLoadPlayer();

function modalClickHandler() {
  if (players) {
    players[0].destroy();
    // you have to remove the player from our global list now
    players.shift() // this removes first item
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
    if (player === players[0]) {
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
      /*console.log({
        in: "onPlayerStateChange",
        playerId: player.id,
        eventData: event.data,
        ytPlayerState: YT.PlayerState.PLAYING,
        players,
        playersLen: players.length
      })*/

      for (let i = 0; i < players.length; i++) {
        const existingPlayer = players[i];
        window.players = players;
        console.log({playersLength: players.length, i, existing: existingPlayer, thisPlayer: player.id})
        if (existingPlayer.id !== player.id) {
          existingPlayer.pauseVideo();
          console.log("pause");
        }
      }
    }
  }

  function addPlayer(video, playerOptions) {
    playerOptions.videoId = playerOptions.videoId || video.dataset.id;
    playerOptions.events = playerOptions.events || {};
    playerOptions.events.onReady = onPlayerReady;
    playerOptions.events.onStateChange = onPlayerStateChange;

    players.push(new YT.Player(video, playerOptions));
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
    return videoPlayer.addPlayer(video, options);
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
    const callback = managePlayer.adder(parent, playerOptions);
    callback();
  }

  return {
    add: addPlayer
  };
}

function onYouTubeIframeAPIReady() {
  loadPlayer.add("ytplayer0", {
    playerVars: {
      loop: 1,
      playlist: "s24NT7TFkUw"
    }
  });
  const myModal = document.querySelector("#myModal");
  myModal.addEventListener("click", function () {

    loadPlayer.add("ytplayer1", {
      videoId: "CHahce95B1g"
    });
    loadPlayer.add("ytplayer2", {});
    loadPlayer.add("ytplayer3", {});
    loadPlayer.add("ytplayer4", {
      playerVars: {
        playlist: "0dgNc5S8cLI,mnfmQe8Mv1g,-Xgi_way56U,CHahce95B1g"
      }
    });
    loadPlayer.add("ytplayer5", {});
  });
}