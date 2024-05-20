$(document).ready(function () {
    var basePath = '../musica/'
    var playlist = ['HearMeNow.mp3', 'Atrasadinha.mp3', 'Sinonimos.mp3', 'BewareOfDarkness.mp3', 'AdventureOfALifetime.mp3', 'HotlineBling.mp3',
        'Thunder .mp3', 'FeetDontFailMeNow.mp3', 'MusaDoInverno.mp3', 'Rude.mp3', 'QuartaCadeira.mp3', 'Cheerleader.mp3', 'BeautifulGirls.mp3',
        'Sunrise.mp3', 'IGottaFeeling.mp3', 'EveryBreathYouTake.mp3', 'Ride.mp3', 'LargadoAsTracas.mp3'
    ]
    var audioPlayer = $('#audio-player')[0]

    function pickRandomTrack(current) {
        let nextTrack = current
        while (nextTrack === current) {
            nextTrack = Math.floor(Math.random() * playlist.length)
        }
        return nextTrack
    }

    function fadeOutAudio(callback) {
        var fadeAudio = setInterval(function () {
            if (audioPlayer.volume > 0.1) {
                audioPlayer.volume -= 0.1
            } else {
                clearInterval(fadeAudio)
                audioPlayer.pause()
                audioPlayer.volume = 1.0
                if (callback) callback()
            }
        }, 200)
    }

    var currentTrack = pickRandomTrack(-1)
    audioPlayer.src = basePath + playlist[currentTrack]

    audioPlayer.play()

    $(audioPlayer).on('ended', function () {
        currentTrack = pickRandomTrack(currentTrack)
        audioPlayer.src = basePath + playlist[currentTrack]
        audioPlayer.play()
    })

    $('.bloco-opcao').click(function () {
        fadeOutAudio(function () {
            console.log('Áudio parado e pronto para a próxima tela.')
        })
    })
})