//////////////////////////////////////////
// prop calc axioms as associative arrays
//require('util.js').factorial()
var predicate_sequence = ["p","q","r","s","t","u","v","a","b","c","d","e","f","g","h"]

axioms = {}
axioms['detac'] = '{"p->q":"p"}'
axioms['denia'] = '{"p->q":"~q"}'
axioms['expan'] = '{"p->q":"p"}'
axioms['disju'] = '{"p|q":"~p"}'
axioms['dilem'] = '{"(p->q)|(r->s)":"p|r"}'
axioms['chain'] = '{"p->q":"q->s"}'
axioms['simpl'] = '{"p|q":"*"}'
axioms['conju'] = '{"p":"q"}'
axioms['addit'] = '{"p":"*"}'

axres = {}
axres['detac'] = 'q'
axres['denia'] = '~p'
axres['expan'] = 'p->(p&q)'
axres['disju'] = 'q'
axres['dilem'] = 'q|s'
axres['chain'] = 'p->s'
axres['simpl'] = 'p'
axres['conju'] = 'p&q'
axres['addit'] = 'p|q'

replacement = {}
replacement['p->q'] = '~p|q' 

operation_sequence = ['->','~','&','|']
operation = {}
operation['|'] = '|'
operation['&'] = '&'
operation['~'] = '~'
operation['->']= '->'


var max_premises = predicate_sequence.length

console.log('\n')

var testProof = 'a -> ~c , ~c -> d, a |- d'

solver(testProof)

function solver(proofStatement) {
	var data= parseProof(proofStatement)
		, end	= data[1]
		, range = data[2]
		, premise = JSON.parse(data[0])
		, i, j, line='', seq=''
		, pad
		, step = []
		, rule = []
		, simplifying = true

	i=0
	while(simplifying) {
		simplifying = false
		for( var x in premise) {
			p = premise[x]
			if( isImplication(p) ) {
				premise[x] = applyImplication(p)
				step[i++] = premise.slice(0)
				rule.push('->')
				simplifying = true
			}
			if( isDemorgan(p) ) {
				premise[x] = applyDemorgan(p)
				if(premise[x] == '') premise[x].pop()
				step[i++] = premise.slice(0)
				rule.push('~~')
				simplifying = true
			}
		}

		////////////////////////////////
		// discuntive denial
		var last_pre = 0
		for( var y in premise) {
			for( var z in premise) {
				if( premise[y] == premise[z] ) continue
						
				if( isDiscuntiveDenial(premise[z], premise[y]) ) {

					var pre = applyDiscuntiveDenial(premise[z])

					if(pre != undefined || pre != " ") {
						if(last_pre == pre) {
							break
						} 
						else {
							last_pre = pre
							premise.push(pre)
						
							premise = arrayUnique(premise)
							//step[i++] = premise.slice(0)
							rule.push('disju')
						}
						simplifying = true
						if(pre == end) simplifying=0;
					}
				}
			}
		}
		step[i++] = premise.slice(0)
		///////////////////////////////
		if(i > 30 ) break		
	}
	
	for(var each in step) {
		chat( each, '|    ', step[each], '\t' ,rule[each])
	}
}
// A|B , ~A |- B
// AB~A  A|B, ~A
// ~ABA  ~A|B, A
// A~B~A A|~B, ~A
// ~A~BA ~A|~B A

function isDiscuntiveDenial(p, q) {
	if(p == undefined || q == undefined) return 0
	if(p.indexOf('~') == -1 && q.indexOf('~') == -1 ) return 0
	var disju_forms = ["AB~A","~ABA","A~B~A","~A~BA"]

	var s =p.split(/[^a-zA-Z\d\~:]/g)
		,s = s.concat(q.split(/[^a-zA-Z\d\~:]/g))

	if(s.length != 3) return 0

	s[0] = s[0].replace(/[0-9]/,'A')
	s[1] = s[1].replace(/[0-9]/,'B')
	s[2] = s[2].replace(/[0-9]/,'A')

	s=s.join('')

	for(var i in disju_forms)
		if(disju_forms[i]==s) return 1
	return 0
}
function arrayUnique(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0 && c != '' && c != undefined) p.push(c);
        return p;
    }, []);
};
function applyDiscuntiveDenial(p) {
	var s =p.split(/\|/g)
		return s[1]
	return s[0]
}
function isImplication(p) {
	if(p != undefined)
		return ( p.indexOf('->') > -1 )
	return 0
}
function applyImplication(p) {
	if(p != undefined)
		return '~' + p.replace(/\->/,'|')
	return 0
}
function isDemorgan(p) {
	if(p != undefined)
		return ( p.indexOf('~~') > -1 )	
	return 0
}
function applyDemorgan(p) {
	if(p != undefined)
		return p.replace(/\~\~/,'')
	return 0
}

function andL(a,b) {
	return (a && b)
}
function orL(a,b) {
	return (a || b)
}
function notL(a) {
	return (!a)
}
function truthTablePadding(n) {
	for(var i=0, s=''; i<n;i++)
		s+='0'
	return s
}

function preparePROP(p) {
	var s=p.replace(/\(.*\)/g,"a"), c=""	
	if(p.length < 2 ) return 'p'
	for( var each in operation ) {
		s = s.replace(each,':'+each+':')
	}
	s = s.split(':')
	for( var part in s) {
		if( s[part] == undefined ) continue
		if( s[part].match(/\w/) ) {
			s[part] = predicate_sequence[i++]
		}
		c+=s[part]
	}
	return c
}

function parseProof(s) {
	var highest = 0
	s = s.toLowerCase();
	s = s.split('')
	for(var c in s) {
		if(s[c].match(/\w/)) {
			s[c] = s[c].charCodeAt(0)-96
			if(s[c] > highest) highest = s[c]
		}
	}
	s = s.join("")
	s = s.replace(/ /g,'')		// remove white space
	var parts	= s.split('|-')	// separate goal and premises
	var conclude= parts.splice(-1) // remove goal
	var premises= JSON.stringify(parts[0].split(',')) // convert to JSON ary
	//chat(premises, goal)
	return [premises,conclude,highest]
}

function matchAxiom(ax,pvar, qvar) {
	var p = JSON.parse(axioms[ax])[pvar]
	if( p != undefined )
		return ( p == qvar )
	return false
}
function chat(){
	var argsv = chat.arguments
	var s=""
	for(var ea in argsv)
		if(argsv[ea] != undefined)
			s += argsv[ea] + " "
	console.log(s)
}
function solvtest() {
	console.log("Propositional Calculus module imported successfully!")
}
exports.ok = solvtest