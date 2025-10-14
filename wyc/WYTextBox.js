function WYTextBox()
{
	this.setRect = function(left, top, width, height)
	{
		this.rect = new WYRect(left, top, width, height);
		this.reverse_rect = this.rect.getReverse();
	}

	this.contains = function(x, y)
	{
		return this.rect.contains(x, y);
	}

	this.drawShadow = function(gc, rect, w, w2)
	{
		gc.beginPath();
		gc.moveTo(rect.left      , rect.top);
		gc.lineTo(rect.left      , rect.bottom);
		gc.lineTo(rect.left  + w , rect.bottom - w2);
		gc.lineTo(rect.left  + w , rect.top    + w);
		gc.lineTo(rect.right - w2, rect.top    + w);
		gc.lineTo(rect.right     , rect.top);
		gc.closePath();
		gc.stroke();
		gc.fill();
	}
}

function WYFlatTextBox(gc, settings)
{
	this.gc = gc;
	this.settings = settings;

	this.foreShadowWidth = 2;
	this.backShadowWidth = 2;
	this.leftMargin = 2;
	this.topMargin = 1;
	this.shadowRate = 0.6;
	this.gradientRate = 1;
	this.isDown = true;
	this.text = "";
	this.cornerRadius = 10; // 角の半径

	this.getText = function()
	{
		return this.text;
	}

	this.setText = function(text)
	{
		this.text = text;
		this.draw();
	}

	this.draw = function()
	{
		var w1 = this.backShadowWidth;
		var w2 = this.foreShadowWidth;
		var g = new WYGraphics(this.gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		g.drawRoundBox(this.rect, w1, w2, this.settings.TextBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);

		g.setColor(this.settings.TextTextColor);
		g.drawString(this.text, this.rect.left + w1 + this.cornerRadius + this.leftMargin, this.rect.top + w1 + this.topMargin);
	}
}

function WYCanvasTextBox(canvas, settings)
{
	this.canvas = canvas;
	this.settings = settings;
	this.org_width = canvas.width;
	this.org_height = canvas.height;
	this.setRect(0, 0, canvas.width, canvas.height);
	this.can_size_up = true;
	this.can_size_down = true;
	this.foreShadowWidth = 2;
	this.backShadowWidth = 2;
	this.leftMargin = 2;
	this.topMargin = 1;
	this.shadowRate = 0.6;
	this.gradientRate = 1;
	this.text = "";
	this.cornerRadius = 10; // 角の半径

	this.getText = function()
	{
		return this.text;
	}

	this.setText = function(text)
	{
		this.text = text;
		this.draw();
	}

	this.change_size = function(g)
	{
		var width = g.getFontMetrics().stringWidth(this.text) + this.cornerRadius * 2 + this.leftMargin + this.foreShadowWidth + this.backShadowWidth;
		var new_width = this.canvas.width;
		if ( this.can_size_up && width > this.canvas.width ) {
			new_width = width;
		} else if ( this.can_size_down && width < this.canvas.width ) {
			new_width = Math.max(width, this.org_width);
		}
		if ( new_width != this.canvas.width ) {
			this.canvas.width = new_width;
			this.setRect(0, 0, canvas.width, canvas.height);
		}
	}

	this.draw = function()
	{
		var g = new WYGraphics(canvas.getContext("2d"), this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		this.change_size(g);
		var w1 = this.backShadowWidth;
		var w2 = this.foreShadowWidth;
		g.drawRoundBox(this.rect, w1, w2, this.settings.TextBackColor, true, this.shadowRate, this.gradientRate, this.cornerRadius);

		g.setColor(this.settings.TextTextColor);
		g.drawString(this.text, this.rect.left + w1 + this.cornerRadius + this.leftMargin, this.rect.top + w1 + this.topMargin);
	}
}

function WYTextElement(element)
{
	this.element = element;

	this.getText = function()
	{
		if ( this.element.value != null ) {
			return this.element.value;
		} else {
			return this.element.innerHTML;
		}
	}

	this.setText = function(text)
	{
		if ( this.element.value != null ) {
			this.element.value = text;
		} else {
			this.element.innerHTML = text;
		}
	}
}

function WYNumericTextBox(gc, settings)
{
	this.gc = gc;
	this.settings = settings;
	this.value = 0;
	this.min_number = 0;
	this.max_number = 100;
	this.value_step = 1;

	this.getNumber = function()
	{
		return this.value;
	}

	this.setNumber = function(value)
	{
		this.value = value;
		this.setText(String(value));
		this.draw();
	}

	this.setMinNumber = function(value)
	{
		this.min_number = value;
	}

	this.setMaxNumber = function(value)
	{
		this.max_number = value;
	}

	this.upNumber = function()
	{
		if ( this.value + this.value_step <= this.max_number ) {
			this.setNumber(this.value + this.value_step);
		}
	}

	this.downNumber = function()
	{
		if ( this.value - this.value_step >= this.min_number ) {
			this.setNumber(this.value - this.value_step);
		}
	}
}

function WYNumericSliderTextBox(gc, settings)
{
	this.gc = gc;
	this.settings = settings;

	this.mousedown = false;
	this.mousedown_x = 0;
	this.mousedown_y = 0;
	this.mousemove_x = 0;
	this.mousemove_y = 0;

	this.mousemove_min_dist = 1;

	this.mousePressed = function(x, y)
	{
		if ( this.contains(x, y) ) {
			this.mousedown = true;
			this.mousedown_x = x;
			this.mousedown_y = y;
			this.mousedown_value = this.value;
		}
	}

	this.mouseReleased = function(x, y)
	{
		this.mousedown = false;
		if ( this.mousemove_y <= this.mousedown_y - this.mousemove_min_dist ) {
			// 上に移動した
			this.upNumber();
		} else if ( this.mousemove_y >= this.mousedown_y + this.mousemove_min_dist ) {
			// 下に移動した
			this.downNumber();
		}
	}

	this.mouseMoved = function(x, y)
	{
		if ( this.mousedown && this.contains(x, y) ) {
			this.mousemove_x = x;
			this.mousemove_y = y;
		}
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

function WYCanvasNumericSliderTextBox(id, settings)
{
	this.canvas = document.getElementById(id);
	this.gc = this.canvas.getContext("2d");
	this.settings = settings;
	this.setRect(0, 0, this.canvas.width, this.canvas.height);
}

WYFlatTextBox.prototype = new WYTextBox();
WYCanvasTextBox.prototype = new WYTextBox();
WYTextElement.prototype = new WYTextBox();
WYNumericTextBox.prototype = new WYFlatTextBox();
WYNumericSliderTextBox.prototype = new WYNumericTextBox();
WYCanvasNumericSliderTextBox.prototype = new WYNumericSliderTextBox();

function createTextBox(id, settings, text)
{
	var canvas = document.getElementById(id);
	var text_box = new WYCanvasTextBox(canvas, settings);
	text_box.setText(text);
	return text_box;
}
