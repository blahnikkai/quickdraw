High
- Add home icon for home button in nav instead of text
- Rearrange nav bar (home should be left of copy link)
- Separate cluttered Game component into Nav, RoomExists, RoomDNE components

Medium
- Allow settings to be changed before entering nickname
- In general, add simple settings and advanced settings. In advanced settings, players have more control
- Fix behavior on leave and rejoin.
    - Game should end if all players leave
    - Allow for rejoining and playing again?
- Add temporary timeout if you enter a wrong phrase
- Add speeding up each round
- Add regex clues

Low
- Display guess status *icons* to player and to other players in player info. 
    - Only for short time, use timeout
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

Live playtesting
- Put something to show you're dead?
- Make it so that everyone can see the timer
- 404 when clicking a game
- Add a name limit
- Be able to unready
- Add some transition time before game starts (and a little bit between rounds)
- Delete previous answer on submit
- Gun noise
- Cowboys shoot whoever loses
- Show a more obvious signal of losing a life
- If you submit right as you die you don't lose a life? maybe saw this?
- Words that don't work (mainly proper nouns): Pluto, europe, 
- Make last part with only two people more suspenseful
- Make 2nd place get shot
- Add custom difficulty in advanced settings
