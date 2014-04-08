var chat = require('./util.js').chat
//var input = '(x&s)->(p&q&(X|Y))->(a|b),(x&s),((A&a)|b)->b,~q->~r,s->q,r,~p|-q'
var input = '~q->~r,r,~r,q->~q|-~q'

//test('(a)->(x&s)->(b)->(p&q&(X|Y))->(a|b)')
var c_ary = ["->","&","|"];

var connection_name = {}
connection_name[c_ary[0]] = 'implication'
connection_name[c_ary[1]] = 'and'
connection_name[c_ary[2]] = 'or'

var Axiom = {}
Axiom['_->_,_'] = resolution
Axiom['_|_,_'] = 0
Axiom['_->_,_->_'] = 0
Axiom['_&_'] = 0
Axiom['_,_'] = 0
Axiom['_'] = demorgans
Axiom[''] = 0

var used_products = {}


function demorgans(p) {
	var l1, l2, 
	l1 = p.get().length
	p = p.get().replace('~~','')
	l2 = p.length
	if(l1 != l2) p = demorgans(p)
	var use = new Premise
	use.init(p)
	chat(use.get())
	return use
}

function resolution(p,q) {
	//chat( p.original, q.original )
	var new_pred
	// DETACHMENT
	if(p.predct[0].get == q.predct[0].get) {
		chat( 'DETACHMENT' )

	}
	// DENIAL
	else if(p.predct[1].key == q.predct[0].key) {
		if(p.predct[1].sign == q.predct[0].sign) return 0
		chat('----------- DENIAL')
		new_pred = p.predct[0]
		new_pred.negate()
		return new_pred.get()		
	}

	return 0
		//chat( p.original, q.original )
		
}

function try_case(p, e, ref, back_ref) {
	//deepPrint(p)


	var pair
	var new_prem = 0
	for(var x in p)
		for(var y in p)
		{
			//if(p[x]==p[y]) continue
			//if(used_products[p[x].original , p[y].original] == undefined)
			//	used_products[p[x].original , p[y].original] = true
			//else continue
			chat(p[x].get(), p[y].get())
			pair = [p[x].mask , p[y].mask]
			new_prem = 0

			if(typeof Axiom[pair] === 'function')
				new_prem = Axiom[pair](p[x],p[y])
			
			if(new_prem == 0) continue



			var new_p = new Premise;
			new_p.init(new_prem)
			p.push(new_p)

			chat( new_p.get() )

			//if(new_prem != 0) {
			//	chat(new_prem.get())
			//	p.push(new_prem)
			//	x = y = 0
			//}
		}

	//deepPrint(p)
}



function begin_solution(statement) {
	chat(statement)
	chat('------------------------------')
	data = emerge(statement, try_case)
	//try_case(data[0], data[1])
}
//convert string into usable objects
function emerge(s, try_case) {
	var end 
	,	hold=s.split('|-')
	,	premise=hold[0].replace(/[^A-Za-z\~\,\&\|\s(->):]/g,'').split(',')
	end = new Predicate
	end.init(hold[1])

	var prem = []
		, ref = []
		, back_ref = []
		, replacement = []
		, ref_index = 0

	for(var p in premise){
		//chat(  premise[p]  )

		replacement = parenthesis_parse(premise[p]) 
		if( replacement != undefined ) {
			for( var r in replacement ) {
				if( ref[replacement[r]] == undefined  ) {
					premise[p] = premise[p].replace(replacement[r],ref_index)
					ref[replacement[r]] = ref_index
					back_ref[ref_index] = replacement[r]
					ref_index++
				}
				else
					premise[p] = premise[p].replace(replacement[r],ref[replacement[r]])
			}
		}


		prem[p] = new Premise
		prem[p].init( premise[p] )

		//chat( premise[p] )
	}

	for(var p in prem) {
		//chat(prem[p].get())
		for(var each in prem[p].predct) {
			var pred = prem[p].predct[each]
			//chat( pred )
			prem[p].predct[each] = new Predicate
			prem[p].predct[each].init(pred)

			//chat(prem[p].predct[each].get())
		}
	}
	var ref_obj = [ref, back_ref]
	try_case(prem, end, ref, back_ref)
}
// parenthesis_parse() returns an array of complex statements that cannot
// be broken down easily
function parenthesis_parse(p) {
	// parser rules
	// remove any unecessary parenthesis (a) = a
	// count open and close parentheses 
	// and when the count changes keep the start and copy to the last
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
		if(p.length == 1) {
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
			return this.sign + this.key + ' Predicate '
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
		var i=0, hold=''
		var ty = p.replace(/[A-Za-z\~\(\)]+/g,'')
		this.mask     = p.replace(/[A-Za-z0-9\~]+/g,'_')
		this.predct   = p.replace(/[^A-Za-z0-9\~]+/g,',').replace(/,+$/, "").split(/,/)
		this.original = p
		this.cardinality = this.predct.length
		// can't access c_Ary global scope inside this
		var c_ary = new Array('->','&','|')
		for(var bin in c_ary) {
			while(ty.indexOf(c_ary[bin])>= 0) { 
				this.connective.push(c_ary[bin])
				ty = ty.replace(c_ary[bin])
				//chat ( c_ary[bin] )	
			}			
		}
		if( this.connective[0] == undefined ) { this.connective.push('_') }
	};
	this.get = function(){
		return this.original + ' Premise '
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

begin_solution(input)