var mainContainer = document.getElementById('js-main-container'),
    loginContainer = document.getElementById('js-login-container'),
    loginButton = document.getElementById('js-btn-login'),
    background = document.getElementById('js-background');

let clientObj = '';
let times = '';

let spotifyPlayer = new SpotifyPlayer();
let spotifyApi = new SpotifyWebApi();
let deviceID = '';

var template = function (data) {
    var key = '6524dd6282a581b16835b8d99cee0ae2';
    var key2 = '2681d0ca08dcb21966cf6cd38c94d4b8';
    var fmKey = '6c8fa2acf11a4df27e6843f084a007b7';
    $('#lyrics').empty();
    $('tbody').empty();
    var songtitle = data.item.name;
    var artist = data.item.artists[0].name;

    //check if entered song title is blank
    if (songtitle !== "") {

        $.ajax({
            type: "GET",
            data: {
                apikey: key,
                q_artist: artist,
                q_track: songtitle,
                format: "jsonp",
                callback: "jsonp_callback"
            },
            url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function (data) {
                lyrics = data.message.body.lyrics;
                $('.lyrics').html(lyrics.lyrics_body + '<br><br>' + lyrics.lyrics_copyright);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    };

    if (artist !== "") {
        $.ajax({
            type: "GET",
            data: {
                api_key: fmKey,
                artist: artist,
                format: "json",
                limit: 10
            },
            url: "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo",
            contentType: 'application/json',
            success: function (data) {
                var bio = data.artist.bio.summary;
                var artistpic = data.artist.image[2]['#text'];
                var relatedartists = data.artist.similar.artist;
                $('#artist-bio').html(bio);

                $("#related-artist-table > thead").append("<tr><th>Related Artists</th></tr>")

                for (var i = 0; i < relatedartists.length; i++) {

                    $("#related-artist-table > tbody").append("<tr><td><img src="
                        + relatedartists[i].image[1]['#text'] + "></td><td>"
                        + relatedartists[i].name + "</td><td>"
                        + '<a href="' + relatedartists[i].url + '"target="_blank">' + relatedartists[i].name + " on lastFM</a></td></tr>");

                }
            }
        });
    };
    return `
    <div class="main-wrapper">
        <div class="now-playing__img">
            <img src="${data.item.album.images[0].url}">
        </div>
        <div class="now-playing__side">
            <div class="now-playing__name">${data.item.name}</div>
            <div class="now-playing__artist">${data.item.artists[0].name}</div>
            <div class="playRow">
                <div class="now-playing__status">${data.is_playing ? 'Playing' : 'Paused'}</div>
                <div class="time"></div>
            </div>
            <div class="progress">
                <div class="progress__bar" style="width:${data.progress_ms * 100 / data.item.duration_ms}%"></div>
            </div>
            <marquee behavior="scroll" direction="up" style="height:200px;" scrollamount="5">
                <div class="lyrics"></div>
                <br>
                <hr>
                <br>
                <div id="artist-bio"></div>
            </marquee>
            <hr>
            <marquee behavior="scroll" direction="up" style="height:200px;" scrollamount="1">
                <div id="relatedartist">
                    <table class="table table-hover" id='related-artist-table'>
                        <thead>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </marquee>
        </div>
    </div>
`;

}

spotifyPlayer.on('update', response => {
    let seconds = response.progress_ms / 1000;
    let timeThing = '';
    ((seconds % 60) < 10) ? (timeThing = '0' + Math.round(seconds % 60)) : (timeThing = Math.round(seconds % 60));
    switch (true) {
        case (!clientObj || response.item.name !== clientObj.item.name):
            mainContainer.innerHTML = template(response);
            break;
        case (response.is_playing !== clientObj.is_playing):
            let resp = response.is_playing ? 'Playing' : 'Paused'
            $('.now-playing__status').html(resp);
            $('.progress__bar').attr('style', 'width:' + (response.progress_ms * 100 / response.item.duration_ms) + '%');
            break;
        case (response.progress_ms !== clientObj.progress_ms):
            $('.progress__bar').attr('style', 'width:' + (response.progress_ms * 100 / response.item.duration_ms) + '%');
            break;
    }
    $('.time').html(Math.floor(seconds / 60) + ':' + timeThing);
    clientObj = response;
    });

spotifyPlayer.on('login', user => {
    spotifyApi.setAccessToken(spotifyPlayer.accessToken);
    if (user === null) {
        loginContainer.style.display = 'flex';
        mainContainer.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        $('#user').html('Welcome ' + user.display_name)
    }
});

loginButton.addEventListener('click', () => {
    spotifyPlayer.login();
});

spotifyPlayer.init();



