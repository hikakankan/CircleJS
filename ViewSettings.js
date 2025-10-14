function ViewSettings()
{
	this.BodyBackColor = new WYColor(220, 240, 255);  // 背景色
	this.BodyTextColor = new WYColor(0, 0, 0);      // テキストの色
	this.ButtonBackColor = new WYColor(200, 220, 255);   // ボタンの色
	this.ButtonTextColor = new WYColor(0, 0, 0);    // ボタンのテキストの色
	this.TextBackColor = new WYColor(255, 240, 240);  // テキストボックスの色
	this.TextTextColor = new WYColor(0, 0, 0);      // テキストボックスのテキストの色

	this.CalcAreaBackColor = new WYColor(255, 240, 240);  // 式の領域の背景色
	this.CalcAreaFrameBackColor = new WYColor(220, 255, 255);   // 選択されていないときの式の背景色
	this.CalcAreaFrameSelectedBackColor = new WYColor(200, 250, 250);      // 選択されたときの式の背景色
	this.CalcAreaFrameColor = new WYColor(150, 200, 200); // 式の枠の色
	this.CalcAreaTextColor = new WYColor(0, 0, 0);           // 式の文字の色

	this.CalcAreaLineColor = new WYColor(0, 0, 0);		// 図形領域の線の色
	this.CalcAreaFillColor = new WYColor(248, 200, 200);	// 図形領域の多角形を塗りつぶす色

	this.MainFont = new GCDefaultFont();
	this.CalcAreaFont = this.MainFont; // 計算領域のフォントは仮にメインウィンドウのフォントを設定しておく

	this.AsciiMode = false; // 掛け算の記号を「＊」、割り算の記号を「／」で表示するモード

	this.ImageSettings = new ImageSettings();			// イメージの設定
	this.UseImage = false;						// イメージを使うかどうか
}

function ImageSettings()
{
}
