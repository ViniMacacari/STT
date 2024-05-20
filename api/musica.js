var player = require('play-sound')(opts = {})

// $ mplayer foo.mp3 
player.play('../src/assets/audio/HearMeNow.mp3', function (err) {
    if (err) console.error(err)
})