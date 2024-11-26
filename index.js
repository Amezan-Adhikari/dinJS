const dinjs_CONVERT_TO_BS = require("./Methods/dinjs_CONVERT_AD_TO_BS.js").module;
const dinjs_PARSE_DATE = require("./Methods/dinjs_PARSE_DATE.js").module;
const dinjs_STRINGIFY_DATE = require("./Methods/dinjs_STRINGIFY_DATE.js").module;
const dinjs_ADD_DATE_BS = require("./Methods/dinjs_ADD_DATE_BS.js").module;
const dinjs_SUB_DATE_BS = require("./Methods/dinjs_SUB_DATE_BS.js").module;
const dinjs_SUB_DAYS_BS = require("./Methods/dinjs_SUB_DAYS_BS.js").module;
const dinjs_DAYS_DIFFERENCE_BS = require("./Methods/dinjs_DAYS_DIFFERENCE_BS.js").module;

class dinjs{
    dateInBS;
    DATE_FORMAT_STRING;
    DATE_OBJECT;

    //default constructor for getting current date call using new dinjs
    constructor(DATE=null,FORMAT_STRING="YYYY-MM-DD",isInBS = false){
            this.DATE_FORMAT_STRING = FORMAT_STRING.toUpperCase();
            
        if(!DATE){
            const dinjs_TODAYS_DATE = new Date();
            let dinjs_CURRENT_YEAR = dinjs_TODAYS_DATE.getFullYear();
            let dinjs_CURRENT_MONTH = dinjs_TODAYS_DATE.getMonth() + 1;
            let dinjs_CURRENT_DATE = dinjs_TODAYS_DATE.getDate();
    
            this.dateInBS = dinjs_CONVERT_TO_BS(this.DATE_FORMAT_STRING,dinjs_CURRENT_YEAR,dinjs_CURRENT_MONTH,dinjs_CURRENT_DATE);
        }
        else if(DATE && FORMAT_STRING && !isInBS){

            let dinjs_DATE = dinjs_PARSE_DATE(DATE,this.DATE_FORMAT_STRING);
            this.dateInBS = dinjs_CONVERT_TO_BS(this.DATE_FORMAT_STRING,dinjs_DATE.YEAR,dinjs_DATE.MONTH,dinjs_DATE.DATE);

        }
        else if(DATE && FORMAT_STRING && isInBS){
            this.dateInBS = DATE;
        }
        else{
            throw new Error("unexpected error occured please check the parameters");
        }

        this.DATE_OBJECT = dinjs_PARSE_DATE(this.dateInBS,this.DATE_FORMAT_STRING);
    }


    #update(){
        this.dateInBS = dinjs_STRINGIFY_DATE(this.DATE_OBJECT,this.DATE_FORMAT_STRING);
    }

  
    addDate(Years,Months,Days){
        try{

            this.DATE_OBJECT = dinjs_ADD_DATE_BS(this.DATE_OBJECT,Years,Months,Days);
            this.#update();
        }
        catch(e){
            console.log(e);
        }
        
    }

    daysDifference(dinjs_DATE){
        try{
            if(!dinjs_DATE instanceof dinjs){
                throw "error: argument not of type dinjs"
            }
    
            return dinjs_DAYS_DIFFERENCE_BS(this.DATE_OBJECT,dinjs_DATE.DATE_OBJECT);
        }catch(e){
            console.log(e);
        }
    }
    
    subtractDays(Days){
        this.DATE_OBJECT = dinjs_SUB_DAYS_BS(this.DATE_OBJECT,Days);
        this.#update();
    }

    addDays(Days){
        this.addDate(0,0,Days);
    }

}

exports.module = dinjs;



