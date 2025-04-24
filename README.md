# Puzzle Colony

A browser-based resource management and island building game where players collect resources by matching tiles and use them to build structures on their island.

## Game Features

- **Resource Collection**: Click on tiles to collect wood, stone, and food resources
- **Building System**: Use resources to construct huts, farms, and mines
- **Progression System**: Level up by building structures to unlock new building types
- **Passive Income**: Farms and mines generate resources automatically every 10 seconds
- **Score Tracking**: Earn points for collecting resources and building structures
- **Notification System**: Get notified when resources are generated or buildings are constructed
- **Interactive Tutorial**: First-time players receive an interactive tutorial
- **Responsive Design**: Play on desktop or mobile devices
- **Keyboard Shortcuts**: Use 'R' to reset, 'H' for help, and 'Esc' to close modals

## How to Play

1. Click on tiles in the grid to collect resources (W = Wood, S = Stone, F = Food)
2. Use your resources to build structures:
   - Huts require 10 Wood
   - Farms require 10 Food
   - Mines require 15 Stone (unlocked at level 2)
3. Farms will generate Food and Mines will generate Stone every 10 seconds
4. Build 3 structures to reach level 2 and unlock the Mine building
5. Try to maximize your score by efficiently collecting and using resources

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external libraries or frameworks required
- Fully client-side, no server required
- Responsive design works on desktop and mobile devices

## Current Features

- **Local Storage**: Game remembers if you've played before
- **Responsive Design**: Adapts to different screen sizes
- **Loading Screen**: Smooth loading experience
- **Keyboard Shortcuts**: Convenient keyboard controls
- **Help Modal**: Interactive instructions for new players
- **Notifications**: Visual feedback for game events
- **Favicon**: Custom game icon

## Future Enhancements

- Save complete game progress to local storage
- Add more building types with unique benefits
- Implement a tech tree for more advanced progression
- Add sound effects and more visual feedback
- Create daily challenges or quests
- Add achievements system

## Running the Game

Simply open the `index.html` file in a web browser to start playing.

```
python -m http.server
```

Then navigate to `http://localhost:8000` in your browser.
