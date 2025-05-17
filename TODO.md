High
- Number of lives select
- Difficulty select
- Round time select (static or increasing)
- Add host privileges, only let the host start
- Add header/nav
- FIX: Each child in a list should have a unique "key" prop. PlayerInfo.tsx:11

Medium
- Display guess status icons to player and to other players in player info. 
    - Only for short time, use timeout
- In general, add simple settings and advanced settings. In advanced settings, players have more control

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
