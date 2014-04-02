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
/*

	s = p.split(/\(\*\)|\-\>/g)
	for( var i in s)
		s[i] = predicate_sequence[i]
	


	//while(c.length > 0)
	for( var op in operand ) {
		
	}


	s = p.replace(/\(.*\)/g,"*")

	for( var op in operand ) {
		var i = s.indexOf(operand[op]) 
		if(i != -1)
			operation[operand[op]].push(i)
	}

	for( var i in operation ) {
		for(var j in operation[i])
			chat(i, 'at', operation[i])
	}

	for( var i in operation )
		operation[i] = new Array

		

				for(var q in premise) {
			var i = 0
			if(premise[p] == premise[q]) continue
			//chat( "cross product of", premise[p], premise[q] )
			
			Palpha = preparePROP( premise[p] ) 
			Qalpha = preparePROP( premise[q] )
			
			chat( "cross product of", Palpha, Qalpha )
			for( var ea in axioms ) {
				++i
				if( matchAxiom(ea, Palpha, Qalpha) || matchFlippedAxiom(ea, Palpha, Qalpha) ) {
					chat( i, ea, axioms[ea], " = ", axres[ea] )
					solver(proofStatement+', '+axres[ea])
					//return;
				}
			}

	//permutate(premises)
	//chat( range )
	//chat( proofStatement , ' = ', premise, end)
	//chat( premise )


	// assign cardinality to predicates 1, 2, 3 ... n<=26
	pad = truthTablePadding(range)
	pred= {}
	for(i=1;i<=range;i++) 
		pred[i] = new Array
	for( i=0; i<Math.pow(2,4); i++) {
		var s = pad.substring(0, pad.length - i.toString(2).length) + i.toString(2)
		card = s.split('')
		for(j=1;j<=range;j++)
			pred[j].push(card[j-1])
	}
	//for(j=1;j<=range;j++)
	//	chat(  pred[j]  )
	for(j=1;j<=range;j++)
		seq+=j+' '
	for(var p in premise) {
		line+=premise[p]+'\t'
	}

	chat( seq, line  )

			
		*/
	//c = p.replace(/\w|\(.*\)/g,'*')
	//c = p.replace(/\(.*\)/g,"")
	//c = c.replace(/\w/g,'')
	//c = c.split(/\*/)