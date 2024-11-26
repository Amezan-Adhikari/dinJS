function dinjs_PARSE_DATE(Date,Format){
    let DATE_OBJECT = {
        YEAR:null,
        MONTH:null,
        DATE:null
    }
   
    
    DATE_OBJECT.YEAR = parseInt(Date.substring(Format.indexOf('Y'),Format.indexOf('Y')+4));
    DATE_OBJECT.MONTH = parseInt(Date.substring(Format.indexOf('M'),Format.indexOf('M')+2));
    DATE_OBJECT.DATE = parseInt(Date.substring(Format.indexOf('D'),Format.indexOf('D')+2));
    
    return DATE_OBJECT;
}

exports.module = dinjs_PARSE_DATE;