// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("pong", "./public/assets/Ball.png");
    this.load.image("palet", "./public/assets/Player90.png");
    this.load.image("red", "./assets/particles/red.png");
  }

  create() {

    // Paleta
    this.paddle = this.physics.add.image(400, 550, "palet").setImmovable();
    this.paddle.body.allowGravity = false;
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setScale(1, 1); // Ajusta el tamaño de la paleta

    // Pelota
    this.ball = this.physics.add.image(400, 500, "pong"); // Cambiado a "pong"
    this.ball.body.allowGravity = false;
    this.ball.setCollideWorldBounds(true).setScale(0.5);
    this.ball.setBounce(1);
    this.ball.setVelocity(0, -350);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Colisión entre pelota y paleta con rebote personalizado
    this.physics.add.collider(this.ball, this.paddle, (ball, paddle) => {
      // Calcula la diferencia entre el centro de la paleta y la pelota
      let diff = ball.x - paddle.x;

      // Ajusta la velocidad X de la pelota según el lado del impacto
      // Multiplica diff para aumentar el efecto (ajusta el factor según lo necesites)
      ball.setVelocityX(diff * 7);
    });

    // Ladrillos
    this.bricks = this.physics.add.staticGroup();

    // Crear una fila de ladrillos (puedes hacer más filas con un bucle)
    for (let x = 100; x <= 700; x += 100) {
      this.bricks.create(x, 100, "logo").setScale(1, 1).refreshBody();
    }

    // Colisión entre pelota y ladrillos
    this.physics.add.collider(this.ball, this.bricks, (ball, brick) => {
      brick.destroy(); // Destruye el ladrillo al colisionar
    });

    // Estado de juego
    this.gameOver = false;

    // Textos de "Perdiste" y "Reiniciar"
    this.loseText = this.add.text(400, 300, '', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.restartText = this.add.text(400, 360, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Tecla R para reiniciar
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (this.gameOver) {
      // Espera a que el jugador presione "R"
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }
      return;
    }

    // Movimiento de la paleta
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-350);
    } else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(350);
    } else {
      this.paddle.setVelocityX(0);
    }

    // Si la pelota cae abajo, muestra mensaje de perder
    if (this.ball.y > 590) {
      this.gameOver = true;
      this.ball.setVelocity(0, 0);
      this.loseText.setText('Perdiste');
      this.restartText.setText('Reiniciar con tecla "R"');
    }
  }
}
