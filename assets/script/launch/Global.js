window.isNullOrEmpty = function(str){    
	if(str == null){
		return true;
    }
    if (str == "") {
        return true;
    }
    let type = typeof(str);
    if (type != "string" && type != "number") {
        cc.error("isNullOrEmpty error type", str)
    }
	return false;
};