High
- BUGFIX: if someone joins after game starts, they can start it again, make them spectate
- Add host privileges to the host
- Only let the host start

Medium
- Add header/nav
- Increasing difficulty
- Wrong guess leads to shorter timer?
- Add speeding up each round
- Display guess status icons to player and to other players in player info. 
    - Only for short time, use timeout
- In general, add simple settings and advanced settings. In advanced settings, players have more control
    - Number of lives select
    - Difficulty select
    - Round time select (static or increasing)

Low
- Add regex clues
- New font
- Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
- Only allow unique nicknames?
- Don't display user info to self? I wrote this a while ago tbh, not sure what it means, just display separately probably
- Add animations/transition to names on join
- Change passing Socket to socketId in backend

Unsorted
- Pass functions to components instead of socket and gid. what this mean?
