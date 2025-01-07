var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
  // 背景色の設定
  this.cameras.main.setBackgroundColor('#99CCFF');

  // 背景作成（物理エンジン対象ではなく、背景となる海）
  this.createBackground();
  
  // 飛行機の作成
  this.createPlane();
  
  // スペースキーでビーム発射
  this.input.keyboard.on('keydown-SPACE', function(event) {
    this.createBeam();
  }, this);
  
  // ゲームオーバーを表す変数。初期値は「false」
  this.isGameOver = false;
  
  // ビームグループの作成
  this.createBeamGroup();
  
  // 敵エイリアンの作成
  this.createAlian();
  
  // 敵レーザーグループの作成
  this.createLaserGroup();
  
};

mainScene.update = function() {
  // ゲームオーバーなら「update」を実行しない
  if( this.isGameOver ) {
    return false;
  }

  // 背景となる海の移動
  this.sea.tilePositionY -= 1;
  
  var speed = 600;
  
  var cursors = this.input.keyboard.createCursorKeys();
  if(cursors.right.isDown) {
    // 右に移動
    this.plane.setVelocityX(speed);
  } else if(cursors.left.isDown) {
    // 左に移動
    this.plane.setVelocityX(-speed);
  } else {
    // 移動停止
    this.plane.setVelocityX(0);
  }
  
  // 敵となるエイリアンが画面上部を左右に移動する
  if (this.alian.x < 100) {
    this.alian.dx = -this.alian.dx;
  }
  if (this.alian.x > 700) {
    this.alian.dx = -this.alian.dx;
  }
  this.alian.x += this.alian.dx;
  
};

mainScene.createBackground = function() {
  // 物理エンジンではなく背景としての海を作成
  this.sea = this.add.tileSprite(0,0, 800, 600, 'sea');
  this.sea.setOrigin(0, 0);

};

mainScene.createPlane = function() {
  // 飛行機を作成する
  this.plane = this.physics.add.image(400, 575, 'plane');
  this.plane.setDisplaySize(70, 70);
  this.plane.setCollideWorldBounds(true);
};

mainScene.createBeamGroup = function() {
  // ビームグループを作成する
  this.beamGroup = this.physics.add.group();
};

mainScene.createBeam = function() {
  // 飛行機が発射するビームを作成する
  var x = this.plane.body.center.x;
  var y = this.plane.body.center.y;
  
  var beam = this.beamGroup.create(x, y, 'beam');
  beam.setDisplaySize(30, 30);
  beam.setVelocityY(-700);
  beam.body.setAllowGravity(false);
};

mainScene.createAlian = function() {
  // 敵となるエイリアンを作成する
  this.alian = this.physics.add.image(400, 80, 'alian');
  this.alian.setDisplaySize(150, 150);
  this.alian.body.setAllowGravity(false);
  this.alian.hp = 10;
  this.alian.dx = 5;
  // 文字の表示
  this.bossText = this.add.text(650, 30, "HP:"+this.alian.hp , {
      font: '40px Open Sans',
      fill: '#ff0000'
  });      
  this.physics.add.overlap(this.alian, this.beamGroup, this.hitAlian, null, this);
  
};

mainScene.createLaserGroup = function() {
  // レーザーグループを作成する
  this.laserGroup = this.physics.add.group();
  
  this.physics.add.overlap(this.plane, this.laserGroup, this.hitPlane, null, this);  
  this.physics.add.overlap(this.laserGroup, this.beamGroup, this.hitLaser, null, this);  
  
  this.laserTimer = this.time.addEvent({
    delay : 500,
    callback : this.createLaser,
    loop : true,
    callbackScope : this
  });  
};

mainScene.createLaser = function() {
  // エイリアンの位置にレーザーを作成する
  var x = this.alian.body.center.x;
  var y = this.alian.body.center.y;
  
  var laser = this.laserGroup.create(x, y, 'laser');
  laser.setDisplaySize(70, 70);
  laser.setAngle(180);
  laser.body.setAllowGravity(false);
  laser.setVelocityY(300);
};

mainScene.hitPlane = function(plane, laser) {
  // 飛行機にレーザーが衝突したのでゲームオーバー
  this.gameOver();
  
};

mainScene.hitLaser = function(laser, beam) {
  // レーザーとビームが衝突したので両方を削除
  laser.destroy();
  beam.destroy();
  
};

mainScene.hitAlian = function(alian, beam) {
  // エイリアンにビームが衝突したときの処理
  beam.destroy();
  alian.hp--;
  var text = "HP:" + alian.hp;
  
  if (alian.hp >= 0) {
    this.bossText.setText(text);
  }
  if (alian.hp <= 0) {
    this.gameClear();
  }
  
};

mainScene.gameOver = function() {
  /*
   * ゲームオーバーの処理
   * 飛行機にレーザーが衝突した
   */
  // ゲームオーバーの変数を「true」
  this.isGameOver = true;
  // ゲームオーバー画像を表示
  this.gameover = this.add.image(400, 300, 'gameover');
  this.gameover.setDisplaySize(500,500);
  
  // 物理エンジン停止
  this.physics.pause();
  // 飛行機を赤色にする
  this.plane.setTint(0xff0000);
  // レーザー作成のタイマーを停止
  this.laserTimer.remove();
  
  // ボタンをおして、スタート画面へ戻る
  this.input.keyboard.on('keydown',function(event){
    this.scene.start("startScene");
  },this);  
};

mainScene.gameClear = function() {
  /*
   * ゲームクリアの処理
   * エイリアンのHPが「0」になった
   */
  // エイリアンを赤色にする
  this.alian.setTint(0xA52A2A);
  // レーザー作成のタイマーを停止
  this.laserTimer.remove();
  
  // 1秒後にエイリアンを削除するタイマー処理
  this.time.addEvent({
    delay : 1000,
    callback : this.destroyAlian,
    loop : false,
    callbackScope : this,
  });
};

mainScene.destroyAlian = function() {
  this.alian.destroy();
  
  // ボタンをおして、スタート画面へ戻る
  this.input.keyboard.on('keydown',function(event){
    this.scene.start("startScene");
  },this);  
  
};
