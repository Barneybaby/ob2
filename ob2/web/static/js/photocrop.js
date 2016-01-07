// Generated by CoffeeScript 1.10.0
(function() {
  var Photocrop,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Photocrop = (function() {
    function Photocrop(container, finished_callback) {
      if (finished_callback == null) {
        finished_callback = null;
      }
      this.mousemove = bind(this.mousemove, this);
      this.mouseup = bind(this.mouseup, this);
      this.mousedown = bind(this.mousedown, this);
      this.container = $(container);
      if (finished_callback !== null) {
        this.finished_callback = finished_callback;
      }
    }

    Photocrop.prototype.load = function(image, max_size) {
      var width_to_height;
      if (max_size == null) {
        max_size = 256;
      }
      this.image = image;
      this.canvas = document.createElement("canvas");
      this.container.empty();
      this.container.append(this.canvas);
      if (this.image.width === 0 || this.image.height === 0) {
        throw "Image has no pixels in it.";
      }
      width_to_height = this.image.width / this.image.height;
      if (this.image.width > this.image.height) {
        this.canvas_width = Math.min(this.image.width, max_size);
        this.canvas_height = this.canvas_width / width_to_height;
      } else {
        this.canvas_height = Math.min(this.image.height, max_size);
        this.canvas_width = this.canvas_height * width_to_height;
      }
      this.canvas.width = this.canvas_width;
      this.canvas.height = this.canvas_height;
      this.context = this.canvas.getContext("2d");
      this.context.drawImage(this.image, 0, 0, this.canvas_width, this.canvas_height);
      this.canvas.addEventListener("mousedown", this.mousedown);
      this.canvas.addEventListener("mouseup", this.mouseup);
      this.canvas.addEventListener("mousemove", this.mousemove);
      this.param_size = Math.min(this.canvas_width, this.canvas_height);
      this.param_topleft = [(this.canvas_width - this.param_size) / 2, (this.canvas_height - this.param_size) / 2];
      this.drawCropSquare(this.param_topleft[0], this.param_topleft[1], this.param_size);
      return this.finished_callback();
    };

    Photocrop.prototype.clear = function() {
      return this.container.empty();
    };

    Photocrop.prototype.drawCropSquare = function(x, y, size) {
      var i, keypoints, len, path, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, results;
      this.context.drawImage(this.image, 0, 0, this.canvas_width, this.canvas_height);
      this.context.lineWidth = 2.0;
      this.context.fillStyle = "rgba(64, 64, 64, 0.85)";
      keypoints = [[0, 0], [x + size, 0], [this.canvas_width - 1, 0], [0, y], [x, y], [x + size, y], [x, y + size], [x + size, y + size], [this.canvas_width - 1, y + size], [0, this.canvas_height - 1], [x, this.canvas_height - 1], [this.canvas_width - 1, this.canvas_height - 1]];
      this.context.beginPath();
      (ref = this.context).moveTo.apply(ref, keypoints[4]);
      (ref1 = this.context).lineTo.apply(ref1, keypoints[5]);
      (ref2 = this.context).lineTo.apply(ref2, keypoints[7]);
      (ref3 = this.context).lineTo.apply(ref3, keypoints[6]);
      this.context.closePath();
      this.context.stroke();
      ref4 = [[0, 1, 5, 3], [1, 2, 8, 7], [8, 11, 10, 6], [10, 9, 3, 4]];
      results = [];
      for (i = 0, len = ref4.length; i < len; i++) {
        path = ref4[i];
        this.context.beginPath();
        (ref5 = this.context).moveTo.apply(ref5, keypoints[path[0]]);
        (ref6 = this.context).lineTo.apply(ref6, keypoints[path[1]]);
        (ref7 = this.context).lineTo.apply(ref7, keypoints[path[2]]);
        (ref8 = this.context).lineTo.apply(ref8, keypoints[path[3]]);
        this.context.closePath();
        results.push(this.context.fill());
      }
      return results;
    };

    Photocrop.prototype.mousedown = function(event) {
      if (event.which === 1) {
        return this.param_start = [event.offsetX, event.offsetY];
      }
    };

    Photocrop.prototype.mouseup = function(event) {
      return this.finished_callback();
    };

    Photocrop.prototype.mousemove = function(event) {
      var rectangle_height, rectangle_width;
      if (event.which === 1) {
        rectangle_width = Math.abs(event.offsetX - this.param_start[0]);
        rectangle_height = Math.abs(event.offsetY - this.param_start[1]);
        this.param_size = Math.max(rectangle_width, rectangle_height) + 1;
        if (event.offsetX < this.param_start[0]) {
          if (event.offsetY < this.param_start[1]) {
            this.param_size = Math.min(this.param_start[0], this.param_start[1], this.param_size);
            this.param_topleft = [this.param_start[0] - this.param_size, this.param_start[1] - this.param_size];
          } else {
            this.param_size = Math.min(this.param_start[0], this.canvas_height - this.param_start[1], this.param_size);
            this.param_topleft = [this.param_start[0] - this.param_size, this.param_start[1]];
          }
        } else {
          if (event.offsetY < this.param_start[1]) {
            this.param_size = Math.min(this.canvas_width - this.param_start[0], this.param_start[1], this.param_size);
            this.param_topleft = [this.param_start[0], this.param_start[1] - this.param_size];
          } else {
            this.param_size = Math.min(this.canvas_width - this.param_start[0], this.canvas_height - this.param_start[1], this.param_size);
            this.param_topleft = [this.param_start[0], this.param_start[1]];
          }
        }
        return this.drawCropSquare(this.param_topleft[0], this.param_topleft[1], this.param_size);
      }
    };

    Photocrop.prototype.toDataURL = function(size) {
      var image_size, image_to_canvas_h, image_to_canvas_w, image_topleft, target_canvas, target_context;
      if (size == null) {
        size = 256;
      }
      target_canvas = document.createElement("canvas");
      image_to_canvas_w = this.image.width / this.canvas_width;
      image_to_canvas_h = this.image.height / this.canvas_height;
      image_topleft = [this.param_topleft[0] * image_to_canvas_w, this.param_topleft[1] * image_to_canvas_h];
      image_size = [this.param_size * image_to_canvas_w, this.param_size * image_to_canvas_h];
      target_canvas.width = size;
      target_canvas.height = size;
      target_context = target_canvas.getContext("2d");
      target_context.drawImage(this.image, image_topleft[0], image_topleft[1], image_size[0], image_size[1], 0, 0, size, size);
      return target_canvas.toDataURL("image/jpeg", 0.85);
    };

    return Photocrop;

  })();

  window.Photocrop = Photocrop;

}).call(this);
