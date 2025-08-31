High
- Add home icon for home button in nav instead of text
- Rearrange nav bar (home should be left of copy link)
- BUG: you can submit after time expires, and other players will lose 2 lives (only tested with 2 total players)
- Separate cluttered Game component into Nav, RoomExists, RoomDNE components
- Configure environment variables to select dev and prod urls

Medium
- Display guess status *icons* to player and to other players in player info. 
    - Only for short time, use timeout
- In general, add simple settings and advanced settings. In advanced settings, players have more control
- Fix behavior on leave and rejoin.
    - Game should end if all players leave
    - Allow for rejoining and playing again?
- Add temporary timeout if you enter a wrong phrase
- Add speeding up each round
- Add regex clues

Low
- Add little cowboy drawings
- Add cowboy sound effects
- Wrong guess leads to shorter timer
- New font
- Only allow unique nicknames?
- Don't display user info to self? I wrote this a while ago tbh, not sure what it means, just display separately probably
- Add animations/transition to names on join
- Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
- Change passing Socket to socketId in backend
- Give a bonus to the person with the rarest word (how would i even implement this bruh)

Unsorted
- Pass functions to components instead of socket and gid. 
what this mean?
a callback, idiot
