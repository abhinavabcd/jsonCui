/**
 * 
 */


function jsonCui(obj,headersObj,div,$){	
	this.obj = obj;
	this.headersObj = headersObj;
	this.div = div;
	this.hooks = {};
    
    var doc = document;
    function create(tag){
    	return doc.createElement(tag);
    };

    this.set = function(keySet, val){
    	var obj = this.obj;
    	if(!keySet || keySet.length==0){
    		return;
    	}
    	if($.isArray(keySet)){
	    	c=0;
	    	while(c < keySet.length-1 ){
	    		if(!obj.hasOwnProperty([keySet[c]]))
	    			obj[[keySet[c]]] = {}
	    		
	    		obj = obj[keySet[c]];
	    		c++;
	    	}
	    	obj[keySet[c]]= val;
    	}
    	else{
    		obj[keySet] = val;
    	}
    };
    
    this.get =function(keySet,obj){
    	var obj = obj==null? this.obj:obj;
    	if(!keySet || keySet.length==0){
    		return obj;
    	}
    	if($.isArray(keySet)){
	    	c=0;
	    	while(c < keySet.length-1 ){
	    		if(!obj.hasOwnProperty(keySet[c]))
	    			return null;
	    		
	    		obj = obj[keySet[c]];
	    		c++;
	    	}
	    	return obj[keySet[c]];
    	}
    	else{
    		return obj[keySet];
    	}
    };
    var addHook = null;
    this.addHook = addHook = function(keySet , renderFunc){
    	var obj = this.hooks;
    	if(!keySet || keySet.length==0){
    		return;
    	}
    	if($.isArray(keySet)){
	    	c=0;
	    	while(c < keySet.length-1 ){
	    		if(!obj.hasOwnProperty(keySet[c]))
	    			obj[[keySet[c]]] = {};
	    		obj = obj[keySet[c]];
	    		c++;
	    	}
	    	obj[keySet[c]]= renderFunc;
    	}
    };
    this.getHook =  function(keySet){
    	if(keySet.length == 0){
    		return null;
    	}
    	return this.get(keySet,this.hooks);
    };
    
    this.createCui = function(){
    	this.addObjCui(this.div, []);
    };
    this.addObjCui = function(elem , keySet){
		var parentObj = this.obj; 
		var obj = this.get(keySet);
		var hook = this.getHook(keySet);
		if(hook){
			this.getHook(keySet)(elem);
			return;
		}
			
		if($.isPlainObject(obj)){

			var table = $('<table><tbody></tbody></table>');
			table[0].parentObj = parentObj
			table[0].keySet = keySet;
			var _table = table[0];
			var div= $("<div>").addClass("objContain");
				div.append(table).append(
					$("<div>")
						.addClass("del")
						.click(function(){ deleteElement(div); parentObj[key]=obj; this.addObjCui(elem,keySet);  })
					);//.append(
				//	$("<div>").addClass("addNewRow").click(function(){addTableRow(table,"stringInput","stringInput");})
				//);
			elem.append(div);	
			for (var i in obj){
				 var tr = $('<tr>').appendTo(table);
	    			tr.append($('<td>').append(i));//key
	           		var tempElem = $('<td>');
	    			tr.append(tempElem);//value
	    			this.addObjCui(tempElem,keySet.concat([i]));
		    	 }
		}
		if($.type( obj )==="array"){
			var v = obj.length ? obj[0] : "string";
			var table = $('<table><tbody></tbody></table>');
			table[0].parentObj = parentObj;
			table[0].keySet = keySet;
			var tempThis = this;
			var addRow = function (v,keySet2){
				return function(){
				 var tr = $('<tr>').appendTo(table);
	    			var tempElem = $('<td>');
	    			tr.append(tempElem);//value
	    			obj.push(JSON.parse(JSON.stringify(v)));
	    			var index = obj.length-1;
	    			tempThis.addObjCui(tempElem,keySet2.concat(index));
				};
			};
			
			var div= $("<div>").addClass("listContain").append(table).append(
				   $("<div>").addClass("addNewRow").click(addRow(JSON.parse(JSON.stringify(v)),keySet.slice(0)))
			).appendTo(elem);
		
			for(var i =0;i<obj.length;i++){
				
				var tr = $('<tr>').appendTo(table);
    			var tempElem = $('<td>');
    			tr.append(tempElem);//value
    			this.addObjCui(tempElem,keySet.concat(i));
			}
		}
		
		if($.type( obj ) === "string"){			
				$("<div>").appendTo(elem).append(obj).click(function(e){
					var p = prompt("Please enter text", obj);
					$(this).html(p ? p : 'null');
					this.set(keySet, p);
				});
		}
		
		if($.type( obj ) === "number"){			
			$("<div>").appendTo(elem).append(obj).click(function(e){
				var p = prompt("Please enter text", obj);
				$(this).html(p ? p : 'null');
				set(keySet, p);
			});
		}
		if($.type( obj ) === "boolean"){			
			$("<input type='checkbox'>").appendTo(elem).click(function(e){
				    var $this = $(this);
				    if ($this.is(':checked')) {
				    	set(keySet, true);
				    } else {
				    	set(keySet,false);
				    }
				});
		}			
	}
}