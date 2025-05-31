High
- Add home icon for home button in nav instead of text
- Rearrange nav
- Separate cluttered Game component into Nav, RoomExists, RoomDNE components

Medium
- Display guess status icons to player and to other players in player info. 
    - Only for short time, use timeout
- In general, add simple settings and advanced settings. In advanced settings, players have more control
- Fix behavior on leave and rejoin. 
    - Game should end if all players leave
    - Allow for rejoining and playing again?

Low
- Add little cowboy drawings
- Add cowboy sound effects
- Wrong guess leads to shorter timer
- Add speeding up each round
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
