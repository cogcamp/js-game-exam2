var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
  // 背景色の設定
  this.cameras.main.setBackgroundColor('#99CCFF');

  // 背景作成（物理エンジン対象ではなく、背景となる海）
  this.createBackground();
  
  // 飛行機の作成
  this.createPlane();
  
  // スペースキーでビーム発射

  
  // ゲームオーバーを表す変数。初期値は「false」
  this.isGameOver = false;
  
  // ビームグループの作成


  // 敵エイリアンの作成


  // 敵レーザーグループの作成


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



};

mainScene.createBeam = function() {
  // 飛行機が発射するビームを作成する



};

mainScene.createAlian = function() {
  // 敵となるエイリアンを作成する



};

mainScene.createLaserGroup = function() {
  // レーザーグループを作成する



};

mainScene.createLaser = function() {
  // エイリアンの位置にレーザーを作成する



};

mainScene.hitPlane = function(plane, laser) {
  // 飛行機にレーザーが衝突したのでゲームオーバー



};

mainScene.hitLaser = function(laser, beam) {
  // レーザーとビームが衝突したので両方を削除



};

mainScene.hitAlian = function(alian, beam) {
  // エイリアンにビームが衝突したときの処理



};

mainScene.gameOver = function() {
  /*
   * ゲームオーバーの処理
   * 飛行機にレーザーが衝突した
   */
  // ゲームオーバーの変数を「true」
  this.isGameOver = true;
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
