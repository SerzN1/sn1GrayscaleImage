(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('sn1Grayscale', function() {

    return {
        grayscale: function (selector, replace) {
			// variables
			var grayscaleClass = 'grayscaled',
				grayscaleWithFilterClass = 'grayscaled_with_filter',
				imagesToProcess = d.querySelectorAll(selector),
				imgArray = Array.prototype.slice.call(imagesToProcess),
				isCanvasSupported = (function (elem){
					return !!(elem.getContext && elem.getContext('2d'));
				})(d.createElement('canvas'));

			// methods
			var makeGrayCopy = isCanvasSupported ? function(item){
					var img = new Image(),
						callback = function() {
							if (replace) {
								item.src = makeGraySrc(item);
								item.className += ' ' + grayscaleClass;
							} else {
								img.src = makeGraySrc(item);
								img.className = item.className + ' ' + grayscaleClass;
								item.parentNode.appendChild(img);
							}
						};
					if (item.complete) {
						callback();
					} else {
						item.onload = callback;
					}
				} : function(item){
					item.className += ' ' + grayscaleClass + ' ' + grayscaleWithFilterClass;
				},
				makeGraySrc = function (imgObj) {
					var canvas = d.createElement('canvas');
					var canvasContext = canvas.getContext('2d');

					var imgW = imgObj.width;
					var imgH = imgObj.height;
					canvas.width = imgW;
					canvas.height = imgH;

					canvasContext.drawImage(imgObj, 0, 0);
					var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

					for(var y = 0; y < imgPixels.height; y++){
						for(var x = 0; x < imgPixels.width; x++){
							var i = (y * 4) * imgPixels.width + x * 4;
							var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
							imgPixels.data[i] = avg;
							imgPixels.data[i + 1] = avg;
							imgPixels.data[i + 2] = avg;
						}
					}
					canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
					return canvas.toDataURL();
				};

			// bind
			imgArray.forEach(makeGrayCopy);

		}
    };
}));



//requirejs(['mod'], function(mod) {
//    mod.sayHi('Marc');
//});
//
//
//var mod = require('./mod');
//mod.sayHi('Marc');
//
//<script src="mod.js"></script>
//<script>mod.sayHi('Marc');</script>