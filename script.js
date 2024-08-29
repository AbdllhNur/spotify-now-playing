const clientId = 'd892757fd70945f4957e620452d65cc3';
const redirectUri = 'https://AbdllhNur.github.io/spotify-now-playing/'; // Your GitHub Pages URL or localhost for testing

const scopes = [
    'user-read-private',
    'user-top-read',
    'user-follow-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-currently-playing'
].join(' ');

function login() {
    const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location = url;
}

function getTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

const accessToken = getTokenFromUrl();
if (accessToken) {
    fetchUserProfile(accessToken);
    fetchCurrentlyPlaying(accessToken);
    fetchTopTracks(accessToken);
    fetchTopArtists(accessToken);
} else {
    login();
}

function fetchUserProfile(accessToken) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('profile-picture').src = data.images[0].url;
        document.getElementById('profile-name').textContent = data.display_name;
        document.getElementById('open-spotify').href = data.external_urls.spotify;
    })
    .catch(error => console.error('Error fetching user profile:', error));
}


function fetchCurrentlyPlaying(accessToken) {
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.item) {
            document.getElementById('album-cover').src = data.item.album.images[0].url;
            document.getElementById('track-name').textContent = data.item.name;
            document.getElementById('artist-name').textContent = data.item.artists.map(artist => artist.name).join(', ');
        }
    })
    .catch(error => console.error('Error fetching currently playing track:', error));
}

function fetchTopTracks(accessToken) {
    fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        data.items.forEach((track, index) => {
            document.getElementById(`top-track${index + 1}`).innerHTML = `
                <img src="${track.album.images[0].url}" alt="${track.name}" class="small-album-cover">
                <div class="track-info">
                    <p>${track.name}</p>
                    <p>${track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error fetching top tracks:', error));
}

function fetchTopArtists(accessToken) {
    fetch('https://api.spotify.com/v1/me/top/artists?limit=12', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const topArtistsContainer = document.getElementById('top-artist-circles');
        topArtistsContainer.innerHTML = ''; // Clear existing data
        data.items.forEach(artist => {
            const artistElement = document.createElement('div');
            artistElement.className = 'artist-circle';
            artistElement.innerHTML = `
                <img src="${artist.images[2].url}" alt="${artist.name}" class="artist-image">
                <p>${artist.name}</p>
            `;
            topArtistsContainer.appendChild(artistElement);
        });
    })
    .catch(error => console.error('Error fetching top artists:', error));
}


