function now() {
  return (+ new Date());
}

function arrayEqual(arr1, arr2) {
  arr1.sort(); arr2.sort();
  if (arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function percentageOf(fraction, total) {
  var division = total / fraction;
  return (division > 0) ? ((1/division)*100) : 0;
}

function hashCode(string) {
  var hash = 0;
  if (string.length == 0) return hash;
  for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// TODO: vervangen met veilige hash
String.prototype.hashCode = function(){
  return hashCode(this);
}

export default {now, arrayEqual, percentageOf, hashCode};
