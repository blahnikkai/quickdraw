High
- UX
    - Use just home icon for home button in nav instead of including text
    - Rearrange UI elements based on Figma mockup.
    - Add animations/transition to names on join
    - Show a more obvious signal of losing a life
        - And a visual signal of being dead. This is less important since input is disabled.
    - Display your own user info separately from everyone elses.
    - Add some transition time before game starts (and a little bit between rounds)
    - Display guess status icons (not just colors) to player and to other players in player info. Only for short time, use timeout
    - Change fonts of certain elements. Cowboy or pixelated?
    - Cowboy theming
        - Cowboys shoot whoever loses
            - Gun noise
        - Little shake animation when you lose a life
        - As you lose lives, you could be getting more and more hanged, could be getting shot
        - Add little cowboy drawings. Let people pick what cowboy they want to be.
        - Add cowboy sound effects

- Bugs
    - If you submit right as you die you don't lose a life? I maybe saw this during live playtesting with the Sebheads?

- Word List
    - Words that don't work but probably should (mainly proper nouns and words from other languages that are basically english): Pluto, europe, uber

- Settings
    - Allow settings to be changed before entering nickname
    - In general, add simple settings and advanced settings. In advanced settings, players have more control
    - In advanced settings
        - Custom difficulty (important for playtesting)
        - Pick whether rareness or longer word is used in 1v1 tiebreaker

- Fix behavior on leave and rejoin
    - Game should end if all players leave
    - Allow for rejoining and playing again?

- Difficulty and timing
    - Add temporary timeout if you enter a wrong phrase
    - Add speeding up each round
    - Wrong guess leads to shorter timer

- Naming and waiting
    - Add a name length limit
    - Only allow unique nicknames
    - Be able to unready

- Gameplay and gamemodes
    - Use the length of the word or the rareness of the word (using wordfreq or similar library) to judge in 1v1s
    - Separate "rare words" gamemode, where a player dies if their word is the least rare.
    - Add regex clues
    - Give a bonus to the person with the rarest word

- Code cleanliness
    - Frontend
        - Separate cluttered Game component into Nav, RoomExists, RoomDNE components
    - Backend
        - Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
        - Change passing Socket to socketId in backend
        - Pass callback functions to components instead of socket and gid.

