 Introduced a speed property in the ball object to represent the ball's speed, while dx and dy are now used purely for direction. The speed can now be adjusted independently.

 The resetTheGame function now correctly resets the ball's speed to the initial value and ensures no multiple increments occur.

 Introduced a gameRunning flag to control whether the game should continue running. The game stops when the modal is displayed and resumes when the player closes the modal.

Used a variable animationId to store and cancel animation frames properly, ensuring the game loop is controlled correctly.