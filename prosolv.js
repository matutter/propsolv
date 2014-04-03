var chat = require('./util.js').chat
var input = 's->(p&q),~r->s,r,~p|-q'

begin_solution(input)

var connection = {}
connection['->'] = 'implication'
connection['&']  = 'and'
connection['|']  = 'or'

//predct have the following
// sign: if there is a negation applied to this predicate
// key : is the letter a-z used to represent any unique predicate
// val : should be set to 1 if a tautology otherwise '?' if not solved yet
// alias : may be a special case key - no defined purpose
function Predicate() {
	this.alias=''
	this.sign=''
	this.key =''
	this.val ='?'
	this.init= function(p) {
		if(p.length == 1) {
			this.sign= ' '
			this.key = p
		}
		else
		{
			p=p.split('')
			this.sign= '~'
			this.key = p[1]
		}
		this.val = '?'
	};
	this.get = function() {
		if(this.sign == '~')
			return this.sign + this.key
		else
			return this.key
	};
};
function Premise() {
	this.predct = []
	this.predct[0]=''
	this.connective = []
	this.cardinality=''
	this.mask=''
	this.original=''
	this.init = function(p){
		var i=0, hold=''
		var ty = p.replace(/[A-Za-z\~\(\)]+/g,'')
		this.mask = p.replace(/[A-Za-z\~]+/g,'_')
		this.predct=p.replace(/[^A-Za-z\~]+/g,',').replace(/,+$/, "").split(/,/)
		this.original = p
		this.cardinality = this.predct.length
		if(ty.indexOf('->')>= 0) this.connective.push('->')
		if(ty.indexOf('&') >= 0) this.connective.push('&')
		if(ty.indexOf('|') >= 0) this.connective.push('|')
		if(this.connective.length==0) this.connective = '0'
		//chat('type:', ty)
		//chat(this.predct, this.type)
	};
	this.get = function(){
		return this.original
	}
	this.deep= function(){
		var s=[]
		for(var ea in this.predct) {
			s.push(this.predct[ea].get())
		}
		return this.original + '\t:' + this.connective + '\t:[' + this.identity + ']' + s + '\t:' + this.mask 
	}
};
Predicate.prototype.negate = function() {
	this.sign += '~'
};
Premise.prototype = {
	exact: function() {
		var s
		for(var i in this.predct)
			s+= this.predct.get()
		return s		
	}
};

function try_case(p, e) {
	//chat(p[0].get(), e.get())
	//deepPrint(p)
	for(var x in p)
		for(var y in p)
		{
			if(p[y]==p[x]) continue
			var pair = []
			pair.push([p[x], p[y], (p[x].get() +','+p[y].get())])


			pred_match( pair[pair.length-1] )
			return
			//chat(pair[0].get(), pair[1].get(), pair[2])
		}		
}

function pred_match(p) {
	var full = p[p.length-1]
	p.pop()

	chat(full)
	for(var ea in p) {
		chat( p[ea].get() )
	}






	//chat(  p[0].get() )
}

function begin_solution(statement) {
	chat(statement)
	emerge(statement, try_case)
}
//convert string into usable objects
function emerge(s, try_case) {
	var end 
	,	hold=s.split('|-')
	,	premise=hold[0].replace(/[^A-Za-z\~\,\&\|\s(->):]/g,'').split(',')
	end = new Predicate
	end.init(hold[1])

	var prem = []
	for(var p in premise){
		//chat(  premise[p]  )
		prem[p] = new Premise
		prem[p].init( premise[p] )	
	}
	for(var p in prem) {
		//chat(prem[p].get())
		for(var each in prem[p].predct) {
			var pred = prem[p].predct[each]
			prem[p].predct[each] = new Predicate
			prem[p].predct[each].init(pred)
			//chat(prem[p].predct[each].get())
		}
	}
	try_case(prem, end)
}
function deepPrint(ea) {
for(var ch in ea )
	chat(ea[ch].deep());

}