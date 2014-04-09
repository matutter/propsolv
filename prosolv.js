var chat = require('./util.js').chat


module.exports = {
	begin_solution: function begin_solution(statement) {
		chat(statement)
		chat('------------------------------')
		return convert_to_object(statement, try_case)
	}
};


//var input = '(x&s)->(p&q&(X|Y))->(a|b),(x&s),((A&a)|b)->b,~q->~r,s->q,r,~p|-q'
//var input = '~q->~r,r,~r,q->~q,(q&p),~~p,(q&p)&p,((q&p)&p)&(p&q)|-~q'

//var input = 'q->r,~~~r,q|p|-p'

var input = '(a|b)->q,~q|-~(a|b)'

//test('(a)->(x&s)->(b)->(p&q&(X|Y))->(a|b)')
var c_ary = ["->","&","|"];

var connection_name = {}
connection_name[c_ary[0]] = 'implication'
connection_name[c_ary[1]] = 'and'
connection_name[c_ary[2]] = 'or'

var Axiom = {}
Axiom['_->_,_'] = resolution
Axiom['_|_,_'] = disjunctive
Axiom['_->_,_->_'] = undefined
Axiom['_&_'] = undefined
Axiom['_,_'] = undefined
Axiom['_'] = demorgans
Axiom[''] = undefined

var  ref = []
	, back_ref = []
	, replacement = []
	, ref_index = 1
	, steps = []
	, step_count = 0

///////////////////////////////////////////////////////
// functions that return strings as a result of 
// a succesful axiom application
function disjunctive(p,q) {
//p | q, ~p |- q
	var new_pred
	if(p.predct[0].key == q.predct[0].key) {
		if(p.predct[0].sign == q.predct[0].sign)
			return undefined
		chat('------------------------------ DISJUNCTION')
		new_pred = p.predct[1]
		return new_pred.get()		

	}

	return undefined
}

function demorgans(p) { 
	var l1, l2, po = p
	l1 = p.length
	p = p.replace(/\~\~/g,'')
	l2 = p.length
	if(l1 != l2) { 
		chat('------------------------------ Demorgans', po, p)
		p = demorgans(p)
	}
	return p
}

function resolution(p,q) {
	// chat( p.original, q.original )
	var new_pred
	// DETACHMENT
	if(p.predct[0].get == q.predct[0].get) {
		chat('------------------------------ Detachment')
		return p.predct[1].get()
	}
	// DENIAL
	else if(p.predct[1].key == q.predct[0].key) {
		if(p.predct[1].sign == q.predct[0].sign)
			return undefined
		chat('------------------------------ DENIAL')
		new_pred = p.predct[0]
		new_pred.negate()
		return new_pred.get()		
	}

	return undefined
}
// END AXIOM FUNCTIONS
////////////////////////////////////////////////////////////
function try_case(p, end) {
	//deepPrint(p)

	//listAll(p)
	var pair
	var last = p.length
	var noRepeat = {}
	for(var x in p)
	{
		noRepeat[p[x].get()] = 1
		for(var y in p)
		{
			noRepeat[p[y].get()] = 1
			if(p[x]==p[y]) // SINGLE PREMISE AXIOM
			{
				pair = p[x].mask

				if(typeof Axiom[pair] === 'function') {
					var new_prem = Axiom[pair](p[x].get())

					if( new_prem == 0 )			continue // no bad ref
					if( new_prem == undefined )	continue // no bad application
					if( noRepeat[new_prem] == 1)continue // new premises only

					steps.push(new_prem)

					p[++last] = new Premise
					p[last].init(new_prem)
					x = y = 0
					if(end.get() == new_prem) {
						chat( 'ALL DONE!', new_prem, '=', end.get() )
						return	steps				
					} 
				}
			}
			else //MULTI PREMISE AXIOM
			{
				pair = [p[x].mask , p[y].mask]
				
				if(typeof Axiom[pair] === 'function') {
					var new_prem = Axiom[pair](p[x],p[y])
					
					if( new_prem == 0 )			continue
					if( new_prem == undefined )	continue
					if( noRepeat[new_prem] == 1)continue

					steps.push(new_prem)

					//chat( 'new', new_prem )
					p[++last] = new Premise
					p[last].init(new_prem)
					x = y = 0
					if(end.get() == new_prem) {
						chat( 'ALL DONE!', new_prem, '=', end.get() )
						return	steps				
					} 
				}
			}
		} // END Y 
	} // END X
	return steps
	listAll( p )
}

/////////////////////////////////////////
// takes strings and convers to premise
// objects
function convert_to_object(s, try_case) {
	var end  = new Premise
	,	hold = new Array
	,	temp = new Array
	hold = s.split('|-')
	end.init(hold[1])
	temp = hold[0].replace(/[^A-Za-z\~\,\&\|\s(->):]/g,',').split(',')

	for(var n in temp) {
		steps.push(temp[n])
		hold = new Premise
		hold.init(temp[n])
		temp[n] = hold
	}
	return replace_reference(temp, end, try_case)
}
////////////////////////////////////////////
// replaces complicated objects with a
// reference id ex: ((x(x)x(x)x)) = 1
function replace_reference(premise, end, try_case) {
	premise.push(end)
	for(var i in premise)
	{
		// ask the parser if the premise needs an index reference
		var temp = parenthesis_parse( premise[i].get() )
		// if not check next one 
		if( temp === undefined ) continue
		//chat( temp, 'will be indexed')

		for(var ea in temp )
		{
			if(ref[temp[ea]] === undefined) 		//if the ref isn't created make it
			{
				ref[temp[ea]] = ref_index	
				back_ref[ref_index] = temp[ea]

				str = premise[i].get().replace(temp[ea],ref_index)
				premise[i] = new Premise 
				premise[i].init(str)

				ref_index ++
			}
			else
			{
				str = premise[i].get().replace(temp[ea],ref[temp[ea]]) 			// if the ref is already created use it
				premise[i] = new Premise 
				premise[i].init(str)			
			}
		}
	}
	end = premise[premise.length-1]
	premise.pop()
	chat( end.get() )
	return try_case(premise, end)
}

function parenthesis_parse(p) {
	// parser rules
	// remove any unecessary parenthesis (a) = a
	// count open and close parentheses 
	// and when the count changes keep the start and copy to the last
	if(p.length == 0) return undefined
	var i = 0
		, len = p.length
		, p2 = p
	p = p.split('')
	for(i=1;i<len-1;i++)
		if(p[i-1]=='('&&p[i+1]==')') {
			 p.splice(i-1,1)
			 p.splice(i,1)
		}

	var count = 0
		,l_count = count
		,first=0
		,last =0
		,free =true
		,parts=[]
	for(i=0;i<len;i++)
	{
		if(p[i] == '(') count++
		else if(p[i] == ')') count--
		if( l_count==0 && count!=0 && free) {
			free=!free
			first = i
		}
		else if(!free && count==0) {
			free=!free
			last = i+1
			parts.push(p.slice(first,last).join(''))
		}
		l_count = count
	}
	if(parts.length !=0)
		return parts
	else return undefined
}


function deepPrint(ea) {
	for(var ch in ea )
		chat(ea[ch].deep());
}

// predct have the following
// sign: if there is a negation applied to this predicate
// key : is the letter a-z used to represent any unique predicate
// val : should be set to 1 if a tautology otherwise '?' if not solved yet
// alias : may be a special case key - no defined purpose
function Predicate() {
	this.sign=''
	this.key =''
	this.init= function(p) {
		if(p.length == 0) {
			return 0
		}
		else if(p.length == 1) {
			this.sign= ''
			this.key = p
		} else {
			p=p.split('')
			this.key = p[p.length-1]
			p.pop()
			this.sign=  p.join('')
		}
	};
	this.get = function() {
			return this.sign + this.key
	};
};
function Premise() {
	this.predct = []
	this.predct[0]=''
	this.connective = []
	this.cardinality=''
	this.mask=''
	this.original=''
	this.ref_flag=0
	this.init = function(p){

		// The original string
		this.original = p
		// a mask that replaces predicates with _
		this.mask     = p.replace(/[A-Za-z0-9\~]+/g,'_')
		// each predicate as an object with a key and sign
		this.predct   = p.replace(/[^A-Za-z0-9\~]+/g,',').replace(/,+$/, "").split(/,/)
		this.cardinality = this.predct.length

		for(var ea in this.predct) {
			var temp = this.predct[ea]
			this.predct[ea] = new Predicate
			this.predct[ea].init(temp)
		}

		var i=0, hold=''
		var ty = p.replace(/[A-Za-z\~\(\)]+/g,'')
		for(var bin in c_ary) {
			while(ty.indexOf(c_ary[bin])>= 0) { 
				this.connective.push(c_ary[bin])
				ty = ty.replace(c_ary[bin],'')
				//chat ( c_ary[bin] )	
			}			
		}
		if( this.connective[0] == undefined ) { this.connective[0] = '_' }
	};
	this.get = function(){
		return this.original
	}
	this.deep= function(){
		var s=[]
		for(var ea in this.predct) {
			s.push(this.predct[ea].get())
		}
		return this.original + '\t:' + this.connective + '\t:[' + this.cardinality + ']' + s + '\t:' + this.mask 
	}
};
Predicate.prototype.negate = function() {
	if (this.sign.length % 2 == 1) this.sign = ''
		else this.sign = '~'
};
Premise.prototype = {
	exact: function() {
		var s
		for(var i in this.predct)
			s+= this.predct.get()
		return s		
	}
};
function listAll(p) {
	for(var i in p) {
		chat(p[i].get())
	}
}

//module.begin_solution(input)