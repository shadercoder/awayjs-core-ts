///<reference path="../../_definitions.ts"/>

module away.gl
{
	export class TextureBase
	{

		public textureType:string = "";
		public _gl:WebGLRenderingContext;

		constructor(gl:WebGLRenderingContext)
		{
			this._gl = gl;
		}

		public dispose():void
		{
			throw "Abstract method must be overridden.";
		}
	}
}