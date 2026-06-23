High
- UX
    - Add animations/transition to names on join
    - Show a more obvious signal of losing a life
        - And a visual signal of being dead. This is less important since input is disabled.
    - Add some transition time before game starts (and a little bit between rounds)
    - Display guess status icons (not just colors) to player and to other players in player info. Only for short time, use timeout
    - Audio
        - Play a random audio from several of the same type (eg on hurt, pick one of hurt1, hurt2, hurt3, ...)
    - Change fonts of certain elements. Cowboy or pixelated?
    - Little shake animation when you lose a life
    - Cowboy theming
        - Cowboys shoot whoever loses
            - Gun noise
        - As you lose lives, you could be getting more and more hanged, could be getting shot
        - Add little cowboy drawings. Let people pick what cowboy they want to be
        - Add cowboy sound effects

- Bugs
    - If you join in the middle of the game, the current round doesn't show time properly
    - If you submit right as you die you don't lose a life? I maybe saw this during live playtesting with the Sebheads?
    - Test that word set definitely doesn't carry over between games somehow. "gonad" was supposedly used even though I think I used it a while ago, seems a bit unlikely that it was the same game

- Word List
    - Words that don't work but probably should (mainly proper nouns and words from other languages that are basically english): Pluto, europe, uber
    - Rarity list is very web based, should change to the one used by word freq

- Settings
    - Allow settings to be changed before entering nickname
    - Add a little message to non-hosts telling them that settings are view only *
    - In general, add simple settings and advanced settings. In advanced settings, players have more control
    - In advanced settings
        - Fully custom difficulty (important for playtesting)
        - Pick whether rareness or longer word is used in 1v1 tiebreaker

- Fix behavior on leave and rejoin
    - Allow for rejoining and playing again? I think I meant like re-entering the game.

- Difficulty and timing
    - Add temporary timeout if you enter a wrong phrase
    - Add speeding up each round
    - Wrong guess leads to shorter timer

- Naming and waiting
    - Add a name length limit
    - Only allow unique nicknames

- Gameplay and gamemodes
    - Use the length of the word or the rareness of the word (using wordfreq or similar library) to judge in 1v1s *
    - Separate "rare words" gamemode, where a player dies if their word is the least rare of everyone
    - Add regex clues
    - Give a bonus to the person with the rarest word

- Code cleanliness
    - Frontend
        - Separate cluttered Game component into Nav, RoomExists, RoomDNE components
    - Backend
        - Map sockets to gid for easy leave on disconnect instead of looping through all games/rooms
        - Change passing Socket to socketId in backend
