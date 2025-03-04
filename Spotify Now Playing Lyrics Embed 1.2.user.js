// ==UserScript==
// @name         Spotify Now Playing Lyrics Embed (Genius)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Embed lyrics from Genius below Spotify track info in web player (Spotify-themed)
// @match        https://open.spotify.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  const observer = new MutationObserver(checkNowPlaying);
  observer.observe(document.body, { childList: true, subtree: true });

  let lastTrack = '';

  function checkNowPlaying() {
    const trackElement = document.querySelector('[data-testid="context-item-info-title"] a');
    const artistElement = document.querySelector('[data-testid="context-item-info-artist"]');

    if (!trackElement || !artistElement) {
      return;
    }

    const trackName = trackElement.innerText.trim();
    const artistName = artistElement.innerText.trim();
    const currentTrack = `${artistName} - ${trackName}`;

    if (currentTrack !== lastTrack) {
      lastTrack = currentTrack;
      fetchLyrics(artistName, trackName);
    }
  }

  function fetchLyrics(artist, track) {
    const searchQuery = encodeURIComponent(`${artist} ${track}`);
    const searchUrl = `https://genius.com/api/search/multi?q=${searchQuery}`;

    GM_xmlhttpRequest({
      method: 'GET',
      url: searchUrl,
      headers: {
        'Accept': 'application/json'
      },
      onload: function(response) {
        const json = JSON.parse(response.responseText);
        const songPath = findSongPath(json, artist, track);

        if (songPath) {
          fetchSongLyrics(songPath);
        } else {
          embedLyrics('<p>Lyrics not found on Genius.</p>');
        }
      },
      onerror: function() {
        embedLyrics('<p>Failed to search Genius.</p>');
      }
    });
  }

  function findSongPath(json, artist, track) {
    const sections = json.response.sections;

    for (const section of sections) {
      if (section.type !== 'song') continue;

      for (const hit of section.hits) {
        const title = hit.result.title.toLowerCase();
        const primaryArtist = hit.result.primary_artist.name.toLowerCase();

        if (title.includes(track.toLowerCase()) && primaryArtist.includes(artist.toLowerCase())) {
          return hit.result.path; // e.g., /songs/1234567
        }
      }
    }
    return null;
  }

  function fetchSongLyrics(songPath) {
    const geniusUrl = `https://genius.com${songPath}`;

    GM_xmlhttpRequest({
      method: 'GET',
      url: geniusUrl,
      onload: function(response) {
        const lyrics = parseLyrics(response.responseText);
        embedLyrics(lyrics);
      },
      onerror: function() {
        embedLyrics('<p>Failed to load lyrics.</p>');
      }
    });
  }

  function parseLyrics(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const lyricsElement = doc.querySelector('[data-lyrics-container]');

    if (!lyricsElement) return '<p>Lyrics not found.</p>';

    return lyricsElement.innerHTML
      .replace(/<br\s*\/?>/gi, '<br>')
      .replace(/href="\//g, 'href="https://genius.com/');
  }

  function embedLyrics(lyricsHTML) {
    const elementA = document.querySelector('.aaFQbW0j0N40v_siz0kX');

    if (!elementA) {
      console.error('element_a not found');
      return;
    }

    let lyricsContainer = document.querySelector('#genius-lyrics-container');
    if (!lyricsContainer) {
      lyricsContainer = document.createElement('div');
      lyricsContainer.id = 'genius-lyrics-container';

      applySpotifyTheme(lyricsContainer);

      elementA.parentNode.insertBefore(lyricsContainer, elementA);
    }

    lyricsContainer.innerHTML = lyricsHTML;
  }

  function applySpotifyTheme(container) {
    container.style.whiteSpace = 'pre-wrap';
    container.style.marginTop = '10px';
    container.style.padding = '12px';
    container.style.border = '1px solid rgba(255, 255, 255, 0.1)'; // Soft Spotify-like border
    container.style.background = 'rgba(255, 255, 255, 0.05)'; // Semi-transparent Spotify panel color
    container.style.color = '#fff'; // White text (like Spotify side panels)
    container.style.maxHeight = '250px';
    container.style.overflowY = 'auto';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.borderRadius = '8px';
    container.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

    // Optional: Scrollbar styling (for Chrome)
    container.style.scrollbarWidth = 'thin';
    container.style.scrollbarColor = '#1DB954 rgba(255, 255, 255, 0.1)';

    // Inject scrollbar styles (for Chromium browsers)
    GM_addStyle(`
      #genius-lyrics-container::-webkit-scrollbar {
        width: 6px;
      }
      #genius-lyrics-container::-webkit-scrollbar-thumb {
        background-color: #1DB954;  /* Spotify green */
        border-radius: 3px;
      }
      #genius-lyrics-container a {
        color: #1DB954;
        text-decoration: none;
        font-weight: 500;
      }
      #genius-lyrics-container a:hover {
        text-decoration: underline;
      }
    `);
  }
})();
