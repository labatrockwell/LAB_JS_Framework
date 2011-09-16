/**********
 *  MATH  *
 **********/
//function labRandom( _min, _max){
//   return Math.random() * ( _max || 1 - _min || 0 ) + _min || 0;
//}

function labRandomInt( _min, _max) {
   return Math.floor( labRandom( _min, _max ));
}

function labRandomObject( _array ){
   return _array[ Math.min(labRandomInt(0, _array.length ), _array.length-1)];
}

function labMap(value, _oldMin, _oldMax, _min, _max){    
   return _min + ((value-_oldMin)/(_oldMax-_oldMin)) * (_max-_min);
}

function labClamp( value, _min, _max ){
   return Math.min( Math.max( value, _min), _max );
}

function labDegToRad( deg ){
   return deg * 0.0174532925;
}

function labRadToDeg( rad ){
   return rad * 57.2957795;
}

/***********
*** MISC ***
************/
function labLog( text ) {
   if (window.console && window.console.log) {
      window.console.log( text );
   } else if (window.dump) {
      window.dump( text );
   }
}