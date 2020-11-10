/**
 * COPYRIGHT: FRANZ LORENZ, KELHEIMWINZERSTR.21f, 93309 KELHEIM
 *
 * @author  Franz Lorenz, Kelheim
 * @file    wheelslider.js
 *
 * Code Example (HTML code):
 * -------------------------
 *  <script src="wheelslider.js"></script>
 *  var Wheel1 = new WheelSlider();
 *  .....
 *  // If the website is loaded completely, then...
 *  Wheel1.init( "canvas1" );
 *  Wheel1.canvas.ontouchmove = function(e){ Wheel1.handleTouchMove(e); };
 *  Wheel1.canvas.onmousemove = function(e){ Wheel1.handleMouseMove(e); };
 *  window.onscroll = function(){ Wheel1.handleResize(); ... }
 *  window.onresize = function(){ Wheel1.handleResize(); ... }
 *  .....
 *  Wheel1.setOption( "TickColor1", <new color> );
 *  Wheel1.setOption( "TickColor2", <new color> );
 *  Wheel1.setOption( "TickColor3", <new color> );
 *  Wheel1.setOption( "TickAngle",  <new value> );
 *  Wheel1.setOption( "TextFont",   <new font> );
 *  Wheel1.setOption( "TextColor",  <new color> );
 *  Wheel1.redraw();       //redraw whole wheel
 */
 
/**
 * aOptions = { TickColor1: "green", TickColor2:"red", TickColor3:"orange" }
 * aOptions["TickColor1"]
 * var aKeys = Object.keys( aOptions )
 * aKeys.includes( "TickColor1" ) --> returns true
 */

class WheelSlider
{
   /**
    * Constructor of the WheelSlider object
    */
   constructor()
   {
      this.canvas = null;
      this.range  = null;
      //
      this.aOptions = {};                                   //initialize all
      this.aOptions["TickColor1"] = "green";                // available
      this.aOptions["TickColor2"] = "red";                  // options
      this.aOptions["TickColor3"] = "orange";
      this.aOptions["TickAngle"]  = 6;
      this.aOptions["TextFont"]   = "30px bold Robot";
      this.aOptions["TextColor"]  = "black";
   }
   
   /**
    * This function initialize the internal 
    * variables and draws the wheelslider.
    * NOTE: The canvas must exists. To ensure
    * this, call this function after the onload
    * event of your website.
    * @param   sCanvasId   ID of the canvas element
    */
   init( sCanvasId )
   {
      this.canvas = document.getElementById( sCanvasId );
      this.handleResize();
      this.drawRangeControl( this.range );
   }

   /**
    * This function handles the resizing of the 
    * page and also of the wheelslider.
    */
   handleResize()
   {
      this.range = this.makeRangeControl( 45, 0, 
                        this.canvas.width-55, 
                        this.canvas.height );
   }

   /**
    * This function sets an option parameter.
    * @param   sOption
    * @param   sValue
    */
   setOption( sOption, sValue )
   {
      if( undefined != this.aOptions[sOption] )
      {
         this.aOptions[sOption] = sValue;
      }
   }

   makeRangeControl( x, y, width, height )
   {
      var range = { x:x, y:y, width:width, height:height };
      range.x1  = range.x + range.width;
      range.y1  = range.y + range.height;
      range.min = -50;
      range.max = +20;
      range.arc =   0;
      range.val =   0;
      return( range );
   }

   /**
    * This function draws a slider-wheel segment
    * for a defined arc and color.
    * @param   ctx      canvas draw context
    * @param   nDeg     angle in degree [-90..+90]
    * @param   sColor   color name
    */
   drawSegment( ctx, nDeg, sColor )
   {
      let nCH = this.range.height / 2;                      //calc middle if the wheel
      let nAn = nDeg/180*3.14;                              //calc angle in rad
      let nY = Math.floor( Math.sin( nAn )*nCH+nCH );       //calc position of segment
      let nW = Math.floor( Math.cos( nAn )*9+1 );           //calc thickness of segment
      ctx.lineWidth = nW;                                   //set thickness
      ctx.lineCap = 'round';                                //set rounded ends of line
      ctx.beginPath();                                      //start painting
      ctx.moveTo( this.range.x, nY );                       //start segment
      ctx.lineTo( this.range.x1, nY );                      //end segment
      ctx.strokeStyle = sColor;                             //set color
      ctx.stroke();                                         //and draw it...
   }

   drawRangeControl( range )
   {
      var nTick  = this.aOptions["TickAngle"];
      var ctx    = this.canvas.getContext("2d");
      var nArc   = this.range.arc;
      var nDeg1  = Math.trunc( ( -90-nArc )/nTick)*nTick + nArc;
      var nDeg2  = Math.floor( ( 90-nArc )/nTick)*nTick + nArc;
      var sColor = 'black';
      //
      ctx.clearRect(0,0,this.canvas.width,this.canvas.height); //erase previous wheel
      sColor = this.aOptions["TickColor1"];                 //get color
      for( var nDeg=nDeg1; nDeg < nArc; nDeg+=nTick )       //draw the first
      {                                                     // half of the
         this.drawSegment( ctx, nDeg, sColor );             // slider wheel
      }
      sColor = this.aOptions["TickColor2"];                 //get color
      this.drawSegment( ctx, nArc, sColor );                //draw the current position
      //
      sColor = this.aOptions["TickColor3"];                 //set color
      for( var nDeg=nArc+nTick; nDeg<nDeg2; nDeg+=nTick )   //draw the second
      {                                                     // half of the
         this.drawSegment( ctx, nDeg, sColor );             // slider wheel
      }
      // value
      ctx.fillStyle     = this.aOptions["TextColor"];       //set text
      ctx.textAlign     = 'left';                           // attributes
      ctx.textBaseline  = 'top';
      ctx.font          = this.aOptions["TextFont"];
      ctx.fillText( parseInt(nArc), 0, this.canvas.height/2 ); // and write it...
   }

   /**
    * This function handles the onmousemove event
    * of the canvas.
    * @param   e     mouse event
    */
   handleMouseMove( e )
   {
      e.preventDefault();                                   //no default handling
      e.stopPropagation();
      if( 1 == e.buttons )                                  //left mouse button pressed?
      {                                                     // yes, then...
         this.handleInputDevice( e.clientX, e.clientY );    // handle the mouse
      }
   }
   
   /**
    * This function handles the ontouchmove event
    * of the canvas.
    * @param   e     touch event
    */
   handleTouchMove( e )
   {
      e.preventDefault();                                   //no default handling
      e.stopPropagation();
      this.handleInputDevice( e.touches[0].clientX, e.touches[0].clientY );
   }
   
   /**
    * This is the common handler of mouse or
    * touch movements.
    * It calculates the wheel position angle
    * from the input device position and 
    * redraws the wheel.
    * @param   nPosX    input device position X
    * @param   nPosY    input device position Y
    */
   handleInputDevice( nPosX, nPosY )
   {
      let Rect = this.canvas.getBoundingClientRect();       //get canvas rectangle
      let mX = parseInt( nPosX-Rect.left );                 //calc mouse position 
      let mY = parseInt( nPosY-Rect.top );                  // within canvas
      mY -= this.range.y;
      if( ( mY >= 0 ) && ( mY < this.range.height ) )       //is mouse inside range-slider?
      {                                                     // yes, then...
         mY -= this.range.height/2;                         // make y symmetric
         this.range.arc = Math.asin( mY/this.range.height*2 )*180/3.14;  // calc angle
         this.drawRangeControl( this.range );                       // redraw range-slider
      }
   }
   
   /**
    * This function forces a redraw of the wheel.
    * You should call this function, if you change
    * any option by setOption( <option>, <value> ).
    */
   redraw()
   {
      this.drawRangeControl( this.range );                  //redraw range-slider
   }
}  //class WheelSlider
