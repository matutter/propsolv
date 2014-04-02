function permutate(p) {
    var states = new Number(p.length)
    console.log( states.permutation(states) )
}

Number.prototype.factorial = function() { 
    var n = 1;
    for(var i = 2; i <= this; i++)
        n*=i; 
    return n;
}
Number.prototype.permutation = function(r) { 
    return (this.factorial() / (this-r).factorial())
}

permutate("123");