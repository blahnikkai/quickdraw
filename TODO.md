High
- In general, add simple settings and advanced settings. In advanced settings, players have more control
    - Number of lives select
    - Difficulty select
    - Round time select (static or increasing)
- Add actual difficulty levels, with both a max and a min. Include debug info to see the number of appearances of a phrase
- Move out that one enum to its own file

Medium
- Add host privileges, only let the host start
- Investigate why the enter key works to submit nickname but not ready up
- Add header/nav
- Wrong guess leads to shorter timer
- Add speeding up each round
- Display guess status icons to player and to other players in player info. 
    - Only for short time, use timeout

Low
- Add regex clues
- New font
- Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
- Only allow unique nicknames?
- Don't display user info to self? I wrote this a while ago tbh, not sure what it means, just display separately probably
- Add animations/transition to names on join
- Change passing Socket to socketId in backend
- Give a bonus to the person with the rarest word

Unsorted
- Pass functions to components instead of socket and gid. what this mean?
