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
    this.load.image("sky", "./assets/space3.png");
    this.load.image("logo", "./assets/phaser3-logo.png");
    this.load.image("red", "./assets/particles/red.png");
  }

  create() {

    // Paleta
    this.paddle = this.physics.add.image(400, 550, "logo").setImmovable();
    this.paddle.body.allowGravity = false;
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setScale(3, 0.3); // Ajusta el tamaño de la paleta

    // Pelota
    this.ball = this.physics.add.image(400, 500, "red");
    this.ball.body.allowGravity = false; // Desactiva la gravedad para la pelota
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
  }

  update() {
    // Movimiento de la paleta
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-350);
    } else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(350);
    } else {
      this.paddle.setVelocityX(0);
    }

    // Si la pelota cae abajo, reiníciala
    if (this.ball.y > 600) {
      this.ball.setPosition(400, 500);
      this.ball.setVelocity(0, -350);
    }
  }
}
