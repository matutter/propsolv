Number.prototype.factorial = function() { 
    var n = 1;
    for(var i = 2; i <= this; i++)
        n*=i; 
    return n;
}
Number.prototype.permutation = function(r) { 
    return (this.factorial() / (this-r).factorial())
}


function permutate(p) {
    var states = new Number(p.length)
    console.log( states.permutation(states) )
}

function proofRow(n, pvar, rule ) {
	var s = n + "\t" + pvar + "\t" + rule
	console.log(s)
}

module.exports = {
  chat: function chat() {
		var argsv = chat.arguments
		var s=""
		for(var ea in argsv) {
			if(argsv[ea] != undefined)
				s += argsv[ea] + " " 
		}
		console.log(s)
  },
  solidify: function solidify(ary) {
	for(var i in ary) {
		if(ary[i] == undefined || ary[i] == '')
			ary.splice(i,1)
	}
	return ary
	}
};
