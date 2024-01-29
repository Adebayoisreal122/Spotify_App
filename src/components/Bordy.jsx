// import React from 'react'

// const Bordy = () => {
//   return (
//     <div>
//         <h1>hello world</h1>
//     </div>
//   )
// }

// export default Bordy




import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Endpoint = "https://api.spotify.com/v1/tracks/";
const clientId = "d1c07c5bfd194887a8db5d7836fbae7c";
const clientSecret = "aa20ba75126f4f85abb06bbe0a9a6368";

const SpotifyTrackInfo = () => {
  const [trackData, setTrackData] = useState([]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        const accessToken = response.data.access_token;
        fetchTrackInfo(accessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    const fetchTrackInfo = async (accessToken) => {
      try {
        const playlistId = '37i9dQZF1DWUf3j9Rl2IUG'; 
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const trackIds = response.data.items.map(item => item.track.id); // Extracting track IDs from the playlist

        const trackDataPromises = trackIds.map(async (trackId) => {
          const trackResponse = await axios.get(`${Endpoint}${trackId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return trackResponse.data;
        });

        const trackDataResults = await Promise.all(trackDataPromises);
        setTrackData(trackDataResults);
        console.log( trackDataResults);
        
      } catch (error) {
        console.error('Error fetching track information:', error);
      }
    };

    fetchAccessToken();
  }, []);

  return (
    <div>
      <h2>Spotify Track Information</h2>
      {trackData.map((track, index) => (
        <div key={index}>
          <h3>Track {index + 1}</h3>
           {track.album.images.length > 0 && (
          <img className='imgs' src={track.album.images[0].url} alt="Album Cover" />
        )}
          <p>Title: {track.name}</p>
          <p>Artist: {track.artists[0].name}</p>
          <p>Album: {track.album.name}</p>
          {track.preview_url && <audio src={track.preview_url} controls></audio>}
        </div>
      ))}
    </div>
  );
};

export default SpotifyTrackInfo;

