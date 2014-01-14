///<reference path="../../build/AME.next.d.ts" />
var tests;
(function (tests) {
    (function (textures) {
        var HTMLImageElementTextureTest = (function () {
            function HTMLImageElementTextureTest() {
                //---------------------------------------
                // Load a PNG
                var mipUrlRequest = new away.net.URLRequest('assets/1024x1024.png');
                this.mipLoader = new away.net.IMGLoader();
                this.mipLoader.load(mipUrlRequest);
                this.mipLoader.addEventListener(away.events.Event.COMPLETE, this.mipImgLoaded, this);
            }
            HTMLImageElementTextureTest.prototype.mipImgLoaded = function (e) {
                var stage = new away.display.Stage();
                var stage3D = stage.getStageGLAt(0);
                var context3D = new away.displayGL.ContextGL(stage3D.canvas);
                var loader = e.target;

                console.log('away.events.Event.COMPLETE', loader);

                this.texture = new away.displayGL.Texture(context3D._gl, loader.width, loader.height);
                this.target = new away.textures.HTMLImageElementTexture(loader.image, false);

                console.log('away.display3D.Texture - Created', this.texture);
                console.log('away.textures.HTMLImageElementTexture - Created', this.target);

                away.textures.MipmapGenerator.generateHTMLImageElementMipMaps(this.target.htmlImageElement, this.texture);
            };
            return HTMLImageElementTextureTest;
        })();
        textures.HTMLImageElementTextureTest = HTMLImageElementTextureTest;
    })(tests.textures || (tests.textures = {}));
    var textures = tests.textures;
})(tests || (tests = {}));
//# sourceMappingURL=HTMLImageElementTextureTest.js.map