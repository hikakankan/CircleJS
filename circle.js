function ClassFigure(x, y)
{
	this.x = x;
	this.y = y;
}

function ClassFigureList()
{
	this.list = new Array();

	this.GetCount = function()
	{
		return this.list.length;
	}

	this.FindInsIndex = function(x, y)
	{
		for ( var i = 0; i < this.GetCount(); i++ ) {
			var e = this.list[i];
			if ( y <= 0 ) {
				// top half
				if ( e.y > 0 ) {
					return i;
				} else if ( e.x == x ) {
					return -1;
				} else if ( e.x < x ) {
					return i;
				}
			} else {
				// bottom half
				if ( e.y <= 0 ) {
				} else if ( e.x == x ) {
					return -1;
				} else if ( e.x > x ) {
					return i;
				}
			}
		}
		return i;
	}

	this.AddPoint = function(x, y)
	{
		var e = new ClassFigure(x, y);
		var index = this.FindInsIndex(x, y);
		if ( index != -1 ) {
			this.list.splice(index, 0, e);
		}
	}

	this.Clear = function()
	{
		this.list = new Array();
	}

	this.getX = function(i)
	{
		return this.list[i].x;
	}

	this.getY = function(i)
	{
		return this.list[i].y;
	}
}

function PictureBox(canvas, settings, txt)
{
	this.canvas = canvas;
	this.settings = settings;
	this.p_r = 2;
	this.ForeColor = this.settings.CalcAreaLineColor;
	this.BackColor = this.settings.CalcAreaBackColor;
	this.flist = new ClassFigureList();
	this.text_status = txt;

	this.Width = function()
	{
		return this.canvas.width;
	}

	this.Height = function()
	{
		return this.canvas.height;
	}

	this.Line = function(g, sx, sy, ex, ey)
	{
		if ( g != null ) {
			g.setColor(this.ForeColor);
			g.drawLine(sx, sy, ex, ey);
		}
	}

	this.Circle = function(g, x, y, r)
	{
		if ( g != null ) {
			g.setColor(this.ForeColor);
			g.drawOval(x - r, y - r, r * 2, r * 2);
		}
	}

	this.Cls = function(g)
	{
		if ( g != null ) {
			g.setColor(this.BackColor);
			g.fillRect(0, 0, this.Width(), this.Height());
		}
	}

	this.paint = function(g)
	{
		var w = this.Width();
		var h = this.Height();
		var ox = w / 2;
		var oy = h / 2;
		var csize;
		if ( ox < oy ) {
			csize = ox * 0.8;
		} else {
			csize = oy * 0.8;
		}
		this.Cls(g);
		this.Circle(g, ox, oy, csize);
		var cnt =  this.flist.GetCount();
		if ( cnt >= 3 ) {
			// 多角形を塗りつぶし
			var xs = new Array();
			var ys = new Array();
			for ( var i = 0; i < cnt; i++ ) {
				var x = this.flist.getX(i);
				var y = this.flist.getY(i);
				var cx = x * csize;
				var cy = y * csize;
				xs.push(ox + cx);
				ys.push(oy - cy);
			}
			g.setColor(this.settings.CalcAreaFillColor);
			g.fillPolygon(xs, ys);
		}
		for ( var i = 0; i < cnt; i++ ) {
			var x1 = this.flist.getX(i);
			var y1 = this.flist.getY(i);
			var cx1 = x1 * csize;
			var cy1 = y1 * csize;
			this.Circle(g, ox + cx1, oy - cy1, this.p_r);
			if ( i + 1 < cnt ) {
				var x2 = this.flist.getX(i + 1);
				var y2 = this.flist.getY(i + 1);
				var cx2 = x2 * csize;
				var cy2 = y2 * csize;
				this.Line(g, ox + cx1, oy - cy1, ox + cx2, oy - cy2);
			} else if ( cnt >= 3 ) {
				var x2 = this.flist.getX(0);
				var y2 = this.flist.getY(0);
				var cx2 = x2 * csize;
				var cy2 = y2 * csize;
				this.Line(g, ox + cx1, oy - cy1, ox + cx2, oy - cy2);
			}
		}
	}

	this.repaint = function()
	{
		var gc = this.canvas.getContext("2d");
		var g = new WYGraphics(gc, this.settings.CalcAreaFont, this.settings.UseImage, this.settings.ImageSettings);
		this.paint(g);
	}

	this.triarea = function(x1, y1, x2, y2)
	{
		// |c-a|=|a|, |c-b|=|b|, a=(x1, y1), b=(x2, y2)
		//   1/4|c||b-a| = 1/4sqrt(cc~(b-a)(b~-a~)) = 1/4sqrt(-c^2(b~-a~)^2)
		// = 1/4sqrt(-(ab~-a~b)^2) = 1/4sqrt(4(x1y2-x2y1)^2)
		// = 1/2abs(x1y2-x2y1)
		return - (x1 * y2 - x2 * y1) / 2;
	}

	this.getarea = function()
	{
		var cnt =  this.flist.GetCount();
		var a = 0;
		for ( var i = 0; i < cnt; i++ ) {
			var x1 = this.flist.getX(i);
			var y1 = this.flist.getY(i);
			if ( i + 1 < cnt ) {
				var x2 = this.flist.getX(i + 1);
				var y2 = this.flist.getY(i + 1);
				a += this.triarea(x1, y1, x2, y2);
			} else if ( cnt >= 3 ) {
				var x2 = this.flist.getX(0);
				var y2 = this.flist.getY(0);
				a += this.triarea(x1, y1, x2, y2);
			}
		}
		return a;
	}

	this.setCount = function(cnt)
	{
		var p = Math.atan(1) * 4;
		this.flist.Clear();
		for ( var i = 0; i < cnt; i++ ) {
			this.flist.AddPoint(Math.cos(2 * p * i / cnt), Math.sin(2 * p * i / cnt));
		}
		this.repaint();
	}

	this.mousePressed = function(x, y)
	{
		var w = this.Width();
		var h = this.Height();
		var ox = w / 2;
		var oy = h / 2;
		var csize;
		if ( ox < oy ) {
			csize = ox * 0.8;
		} else {
			csize = oy * 0.8;
		}
		var r = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy));
		if ( Math.abs(r - csize) < 10 ) {
			this.flist.AddPoint((x - ox) / r, - (y - oy) / r);
			this.text_status.setText(String(this.getarea()));
			this.repaint();
		}
	}

	this.mouseReleased = function(x, y)
	{
	}

	this.mouseMoved = function(x, y)
	{
	}

	this.touchStart = function(x, y)
	{
		this.mousePressed(x, y);
	}

	this.touchEnd = function(ids)
	{
		this.mouseReleased(0, 0);
	}

	this.touchMove = function(x, y)
	{
		this.mouseMoved(x, y);
	}
}

function init()
{
	var settings = new ViewSettings();
	var settings = new ViewSettings();
	document.body.style.background = settings.BodyBackColor.getColor();
	document.body.style.color = settings.BodyTextColor.getColor();

	var text_status = createTextBox("status-canvas", settings, "");

	var circle_canvas = document.getElementById("circle-canvas");
	var PictureFigure = new PictureBox(circle_canvas, settings, text_status);
	PictureFigure.repaint();

	def_mouse_event_in_obj(PictureFigure);
}
