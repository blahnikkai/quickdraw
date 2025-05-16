High
- BUGFIX: if someone joins after game starts, they can start it again, make them spectate
- Only let the host start
- Add regex clues
- Show ready vs not ready with colors instead of position
- Add number of lives select

Medium
- New font
- Add a copy link button
- Increasing difficulty
- Wrong guess leads to shorter timer?
- Display guess status icons to player and to other players in player info. 
    - Only for short time, use timeout

Low
- Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
- Only allow unique nicknames?
- Don't display user info to self? I wrote this a while ago tbh, not sure what it means, just display separately probably
- Add animations/transition to names on join
- Change passing Socket to socketId in backend

Unsorted
- Pass functions to components instead of socket and gid
