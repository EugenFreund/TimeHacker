import Phaser from 'phaser';
import { GameDialog } from '../gameDialog';

export class GameScene extends Phaser.Scene {
    private gameDialog!: GameDialog;
    private player!: Phaser.GameObjects.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key; };
    private scoreText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private timeText!: Phaser.GameObjects.Text;
    private gameRunning = false;
    private gameTimer: Phaser.Time.TimerEvent | null = null;
    private score = 0;
    private lives = 3;
    private level = 1;
    private gameTime = 0;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // Create fallback colored rectangles for sprites
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 32, 32)
            .generateTexture('player', 32, 32);
        
        this.add.graphics()
            .fillStyle(0xff0000)
            .fillRect(0, 0, 24, 24)
            .generateTexture('enemy', 24, 24);
        
        this.add.graphics()
            .fillStyle(0xffff00)
            .fillRect(0, 0, 16, 16)
            .generateTexture('powerup', 16, 16);
        
        this.add.graphics()
            .fillStyle(0x333333)
            .fillRect(0, 0, 800, 600)
            .generateTexture('background', 800, 600);
    }

    create(): void {
        // Initialize game dialog
        this.gameDialog = new GameDialog(this);
        
        // Create background
        this.add.image(400, 300, 'background');
        
        // Create player
        this.player = this.add.sprite(400, 300, 'player');
        this.player.setScale(1.5);
        
        // Create input handlers
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,S,A,D') as any;
        
        // Create UI text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '18px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });
        
        this.livesText = this.add.text(20, 50, 'Lives: 3', {
            fontSize: '18px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });
        
        this.levelText = this.add.text(20, 80, 'Level: 1', {
            fontSize: '18px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });
        
        this.timeText = this.add.text(20, 110, 'Time: 0', {
            fontSize: '18px',
            color: '#00ff00',
            fontFamily: 'monospace'
        });
        
        // Start the game
        this.startGame();
    }

    update(): void {
        if (!this.gameRunning) return;
        
        // Handle player movement
        const speed = 200;
        
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.x -= speed * (this.game.loop.delta / 1000);
        }
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.x += speed * (this.game.loop.delta / 1000);
        }
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.y -= speed * (this.game.loop.delta / 1000);
        }
        if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.y += speed * (this.game.loop.delta / 1000);
        }
        
        // Keep player within bounds
        this.player.x = Phaser.Math.Clamp(this.player.x, 16, 784);
        this.player.y = Phaser.Math.Clamp(this.player.y, 16, 584);
        
        // Update UI
        this.updateUI();
    }

    private startGame(): void {
        this.gameRunning = true;
        
        // Start game timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.gameTime++;
            },
            loop: true
        });
        
        // Show intro dialog
        this.gameDialog.showDialog([
            "Welcome to Time Hacker!",
            "Use arrow keys or WASD to move",
            "Avoid enemies and collect power-ups",
            "Press ENTER to continue..."
        ], () => {
            // Game starts after dialog
        });
    }

    private updateUI(): void {
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
        this.levelText.setText(`Level: ${this.level}`);
        this.timeText.setText(`Time: ${this.gameTime}`);
    }

    public pauseGame(): void {
        this.gameRunning = false;
        if (this.gameTimer) {
            this.gameTimer.paused = true;
        }
    }

    public resumeGame(): void {
        this.gameRunning = true;
        if (this.gameTimer) {
            this.gameTimer.paused = false;
        }
    }
}
