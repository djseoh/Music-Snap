
var mainContainer = document.getElementById('js-main-container'),
loginContainer = document.getElementById('js-login-container'),
loginButton = document.getElementById('js-btn-login'),
background = document.getElementById('js-background');

let clientObj = '';

let spotifyPlayer = new SpotifyPlayer();
let spotifyApi = new SpotifyWebApi();
let deviceID = '';

var template = function (data) {
return `
<div class="main-wrapper">
  <div class="now-playing__img">
    <img src="${data.item.album.images[0].url}">
  </div>
  <div class="now-playing__side">
    <div class="now-playing__name">${data.item.name}</div>
    <div class="now-playing__artist">${data.item.artists[0].name}</div>
    <div class="play-row">
    <button class="prev-btn" onClick="play(${data.is_playing})">play/pause</button>
    <div class="now-playing__status">${data.is_playing ? 'Playing' : 'Paused'}</div>
    </div>
    <div class="progress">
      <div class="progress__bar" style="width:${data.progress_ms * 100 / data.item.duration_ms}%"></div>
    </div>
  </div>
</div>
<div class="background" style="background-image:url(${data.item.album.images[0].url})"></div>
`;
};

function grabAlbum(playing) {
spotifyApi.getMyDevices( function (error, datas) {
console.log(datas.devices);
let id = {
  device_id: datas.devices[0].id
}
playing ? spotifyApi.pause(id) : spotifyApi.play(id);
})
}

spotifyPlayer.on('update', response => {
switch (true) {
case (!clientObj || response.item.name !== clientObj.item.name) : 
mainContainer.innerHTML = template(response);
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

