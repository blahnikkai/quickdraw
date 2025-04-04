High
- Show names even when not ready, separated or colored differently
- New font
- BUGFIX: players that aren't readied up still play if someone else starts the game, and players without a nickname will be "Player"
- BUGFIX: players can enter no nickname
- Make player info not shift up on status
- Make player info a grid?
- BUGFIX: spectating players can submit

Medium
- UX prettification
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
