///<reference path="../../build/awayjs.next.d.ts" />

module tests.net
{
	import Delegate				= away.utils.Delegate;

    export class LoaderTest //extends away.events.EventDispatcher
    {

        private urlLoaderPostURLVars        : away.net.URLLoader;
        private urlLoaderGetCSV             : away.net.URLLoader;
        private urlLoaderErrorTest          : away.net.URLLoader;
        private urlLoaderGetURLVars         : away.net.URLLoader;
        private urlLoaderBinary             : away.net.URLLoader;
        private urlLoaderBlob               : away.net.URLLoader;
        private urlLoaderArrb               : away.net.URLLoader;

        constructor()
        {

            console.log( 'start');

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // POST URL Variables to PHP script
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            this.urlLoaderPostURLVars               = new away.net.URLLoader();
            this.urlLoaderPostURLVars.dataFormat    = away.net.URLLoaderDataFormat.VARIABLES;

            var urlStr : string     = 'fname=karim&lname=' + Math.floor( Math.random() * 100 );
            var urlVars             = new away.net.URLVariables( urlStr );

            var req                 = new away.net.URLRequest( 'assets/saveData.php' );
                req.method          = away.net.URLRequestMethod.POST;
                req.data            = urlVars;

            this.urlLoaderPostURLVars.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.postURLTestComplete) );
            this.urlLoaderPostURLVars.addEventListener( away.events.IOErrorEvent.IO_ERROR, Delegate.create(this, this.ioError) );
            this.urlLoaderPostURLVars.load( req );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // GET CSV File
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var csrReq = new away.net.URLRequest( 'assets/airports.csv' );

            this.urlLoaderGetCSV                    = new away.net.URLLoader();
            this.urlLoaderGetCSV.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
            this.urlLoaderGetCSV.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.getCsvComplete ) );
            this.urlLoaderGetCSV.addEventListener( away.events.Event.OPEN, Delegate.create(this, this.getCsvOpen ) );
            this.urlLoaderGetCSV.addEventListener( away.events.IOErrorEvent.IO_ERROR, Delegate.create(this, this.ioError) );
            this.urlLoaderGetCSV.load( csrReq );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // ERROR test - load a non-existing object
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var errorReq = new away.net.URLRequest( 'assets/generatingError' );

            this.urlLoaderErrorTest                    = new away.net.URLLoader();
            this.urlLoaderErrorTest.dataFormat         = away.net.URLLoaderDataFormat.TEXT;
            this.urlLoaderErrorTest.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.errorComplete ) );
            this.urlLoaderErrorTest.addEventListener( away.events.IOErrorEvent.IO_ERROR, Delegate.create(this, this.ioError) );
            this.urlLoaderErrorTest.addEventListener( away.events.HTTPStatusEvent.HTTP_STATUS, Delegate.create(this, this.httpStatusChange) );
            this.urlLoaderErrorTest.load( errorReq );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // GET URL Vars - get URL variables
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var csrReq = new away.net.URLRequest( 'assets/getUrlVars.php' );

            this.urlLoaderGetURLVars                    = new away.net.URLLoader();
            this.urlLoaderGetURLVars.dataFormat         = away.net.URLLoaderDataFormat.VARIABLES;
            this.urlLoaderGetURLVars.addEventListener( away.events.IOErrorEvent.IO_ERROR, Delegate.create(this, this.ioError) );
            this.urlLoaderGetURLVars.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.getURLVarsComplete ) );
            this.urlLoaderGetURLVars.load( csrReq );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // LOAD Binary file
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var binReq = new away.net.URLRequest( 'assets/suzanne.awd' );

            this.urlLoaderBinary                    = new away.net.URLLoader(  );
            this.urlLoaderBinary.dataFormat         = away.net.URLLoaderDataFormat.BINARY;
            this.urlLoaderBinary.addEventListener( away.events.IOErrorEvent.IO_ERROR, Delegate.create(this, this.ioError) );
            this.urlLoaderBinary.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.binFileLoaded ) );
            this.urlLoaderBinary.load( binReq );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // LOAD Blob file
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var blobReq = new away.net.URLRequest( 'assets/2.png' );

            this.urlLoaderBlob                    = new away.net.URLLoader(  );
            this.urlLoaderBlob.dataFormat         = away.net.URLLoaderDataFormat.BLOB;
            this.urlLoaderBlob.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.blobFileLoaded ) );
            this.urlLoaderBlob.load( blobReq );

            //---------------------------------------------------------------------------------------------------------------------------------------------------------
            // ARRAY_BUFFER Test
            //---------------------------------------------------------------------------------------------------------------------------------------------------------

            var arrBReq = new away.net.URLRequest( 'assets/1.jpg' );

            this.urlLoaderArrb                    = new away.net.URLLoader(  );
            this.urlLoaderArrb.dataFormat         = away.net.URLLoaderDataFormat.ARRAY_BUFFER;
            this.urlLoaderArrb.addEventListener( away.events.Event.COMPLETE , Delegate.create(this, this.arrayBufferLoaded ) );
            this.urlLoaderArrb.load( arrBReq );

        }

        private arrayBufferLoaded( event : away.events.Event ) : void
        {

            var arrayBuffer = this.urlLoaderArrb.data;
            var byteArray = new Uint8Array(arrayBuffer);

            console.log( 'LoaderTest.arrayBufferLoaded' , byteArray[1]);

            for (var i = 0; i < byteArray.byteLength; i++) {
                //console.log( byteArray[i] );
            }

        }

        private blobFileLoaded( event : away.events.Event ) : void
        {

            var blob        = new Blob([this.urlLoaderBlob.data], {type: 'image/png'});
            var img         = document.createElement('img');
                img.src     = this.createObjectURL( blob );//window['URL']['createObjectURL'](blob);
                img.onload  = function(e) {

                    window['URL']['revokeObjectURL'](img.src); // Clean up after yourself.

                };

            console.log( 'LoaderTest.blobFileLoaded' , blob );

            document.body.appendChild( img );

        }

        private createObjectURL( fileBlob )
        {

            // For some reason TypeScript has "window.URL.createObjectURL" in it's dictionary -
            // but window.URL causes an error
            // cannot make my own .d.ts file either ( results in duplicate definition error )
            // This HACK gets it to work: window['URL']['createObjectURL']

            if( window['URL'] ){

                if ( window['URL']['createObjectURL'] ) {

                    return window['URL']['createObjectURL']( fileBlob );

                }

            } else {

                if ( window['webkitURL'] ){

                    return window['webkitURL']['createObjectURL']( fileBlob );

                }

            }

            return null;

        }

        private binFileLoaded( event : away.events.Event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.binFileLoaded' , loader.data.length );

        }

        private getURLVarsComplete( event : away.events.Event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.getURLVarsComplete' , loader.data );


        }

        private httpStatusChange( event : away.events.HTTPStatusEvent ) : void
        {

            console.log( 'LoaderTest.httpStatusChange' , event.status );

        }

        private ioError( event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.ioError' , loader.url );

        }

        private errorComplete( event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.errorComplete' );//, loader.data );

        }

        private postURLTestComplete( event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.postURLTestComplete' , loader.data );

        }

        private getCsvComplete( event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.getCsvComplete' );//, loader.data );

        }

        private getCsvOpen( event ) : void
        {

            var loader : away.net.URLLoader = <away.net.URLLoader> event.target;
            console.log( 'LoaderTest.getCsvOpen' );

        }

    }
}
