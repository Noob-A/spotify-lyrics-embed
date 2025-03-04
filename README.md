# Spotify Genius Lyrics Embed - Tampermonkey Script

This Tampermonkey script automatically fetches and embeds **song lyrics** from [Genius.com](https://genius.com) directly into the **Spotify Web Player** interface.

## Features

- Fetches **currently playing track and artist** from Spotify Web Player.
- Searches for lyrics on Genius.
- Embeds lyrics **below the currently playing track information**.
- Automatically updates when the song changes.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey.
3. Paste the content of `spotify-genius-lyrics.user.js` into the editor.
4. Save and enable the script.
5. ENABLE THE NOW PLAYING VIEW: <br>![image](https://github.com/user-attachments/assets/a3818a9d-b46b-4f4a-ba85-52a4dbe4fd18)
6. Open [Spotify Web Player](https://open.spotify.com) and play some music.
7. You should see it appear:
8. ![image](https://github.com/user-attachments/assets/fb4830ca-03f4-498a-a453-645707bafc1f)




## Requirements

- Modern browser (Chrome, Firefox, etc.)
- Tampermonkey extension.

## Notes

- This script does not require any authentication or API keys.
- It scrapes public Genius search and lyrics pages.
- This script is for **personal use** and is not affiliated with Spotify or Genius.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
