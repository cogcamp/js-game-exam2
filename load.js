// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");

loadScene.preload = function() {
  // スタート画像
  this.load.image('gamestart', 'assets/images/gamestart.gif');
  // ゲームオーバー画像
  this.load.image('gameover', 'assets/images/gameover.png');
  // 背景画像
  this.load.image('sea', 'assets/images/sea.jpg');
  // 飛行機画像の読み込み
  this.load.image('plane', 'assets/images/plane.png');
  // ビーム画像の読み込み
  this.load.image('beam', 'assets/images/beam.png');
  // エイリアン画像の読み込み
  this.load.image('alian', 'assets/images/alian.png');
  // レーザー画像の読み込み
  this.load.image('laser', 'assets/images/laser.png');

};

loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
