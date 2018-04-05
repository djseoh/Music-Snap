var mainContainer = document.getElementById('js-main-container'),
loginContainer = document.getElementById('js-login-container'),
loginButton = document.getElementById('js-btn-login'),
background = document.getElementById('js-background');

let clientObj = '';

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

console.log(songtitle)
console.log(artist);
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
            console.log(data);

            console.log(data.message.body.lyrics.lyrics_body);

            lyrics = data.message.body.lyrics;

            $('.lyrics').html(lyrics.lyrics_body);

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
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo",
        contentType: 'application/json',
        success: function (data) {
            console.log(data);

            var bio = data.artist.bio.summary;
            var artistpic = data.artist.image[2]['#text'];
            var relatedartists = data.artist.similar.artist;
            console.log(relatedartists);

            $('#artist-bio').html('<img src =' + artistpic + '><br>' + bio + '<br>');

            $("#related-artist-table > thead").append("<tr><th>Related Artists</th></tr>")

            for (var i = 0; i < relatedartists.length; i++) {

                $("#related-artist-table > tbody").append("<tr><td><img src="
                    + relatedartists[i].image[1]['#text'] + "></td><td>"
                    + relatedartists[i].name + "</td><td>"
                    + '<a href="' + relatedartists[i].url + '"target="_blank">' + relatedartists[i].name + " on lastFM</a></td></tr>");

                console.log(relatedartists[i]);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
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
    <div class="now-playing__status">${data.is_playing ? 'Playing' : 'Paused'}</div>
    <div class="progress">
        <div class="progress__bar" style="width:${data.progress_ms * 100 / data.item.duration_ms}%"></div>
    </div>
    <p>
<a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Toggle first element</a>
<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">Toggle second element</button>
<button class="btn btn-primary" type="button" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">Toggle both elements</button>
</p>
<div class="row">
<div class="col">
<div class="collapse multi-collapse" id="multiCollapseExample1">
    <div class="card card-body">
    <div class="lyrics"></div>
    <div id="artist-bio">
    </div>
    </div>
</div>
</div>
<div class="col">
<div class="collapse multi-collapse" id="multiCollapseExample2">
    <div class="card card-body">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
    </div>
</div>
    <div id="artist">
        <table class="table table-hover" id='artist-table'>
                <thead>
                </thead>
                <tbody>
                </tbody>
        </table>

</div>
<div id="relatedartist">
    <table class="table table-hover" id='related-artist-table'>
            <thead>
            </thead>
            <tbody>
            </tbody>
    </table>
</div>
</div>
</div>
<div class="background" style="background-image:url(${data.item.album.images[0].url})"></div>
`;

}

spotifyPlayer.on('update', response => {
switch (true) {
case (!clientObj || response.item.name !== clientObj.item.name) : 
mainContainer.innerHTML = template(response);
console.log(response)
break;
case (response.is_playing !== clientObj.is_playing) :
$('.now-playing__status').html(response.is_playing);
$('.progress__bar').attr('style', 'width:' + (response.progress_ms * 100 / response.item.duration_ms) + '%')
break;
case (response.progress_ms !== clientObj.progress_ms) :
$('.progress__bar').attr('style', 'width:' + (response.progress_ms * 100 / response.item.duration_ms) + '%')
break;
}
clientObj = response;
});

spotifyPlayer.on('login', user => {
spotifyApi.setAccessToken(spotifyPlayer.accessToken);
console.log(user);
console.log(spotifyPlayer.accessToken)
if (user === null) {
loginContainer.style.display = 'block';
mainContainer.style.display = 'none';
} else {
loginContainer.style.display = 'none';
mainContainer.style.display = 'block';
}
});

loginButton.addEventListener('click', () => {
spotifyPlayer.login();
});

spotifyPlayer.init();



