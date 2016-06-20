import {Component, OnInit, EventEmitter,ElementRef} from "@angular/core";
import {Control, Validators, ControlGroup} from "@angular/common";
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: "custom-datepicker",
    templateUrl:"../../../assets/templates/widgets/datepicker/datepicker.html",
    styleUrls: ["../../../assets/css/widgets/datepicker/datepicker.css"],
    inputs: ["datePickerConfig"],
    outputs: ["dateChange"],
    directives: [DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent implements OnInit {
    
    // Config object for date picker control passed by parent component
    private datePickerConfig:any;
    
    // For date picker textbox
    private controlName:string;
    private helpText:string;
    private disableTyping:boolean;
    private errorText:string;
    private showHelpText: boolean;
    private displayedText:string;
    private displayedTextCssClass:boolean;
    private dateFormat:string;
    private formattedDate:string;
    private datePickerTextControl:HTMLElement;
    private datePickerWidgetContainer:HTMLElement;
    private datePickerInnerContainer:Element;
    private dateControlGroup:ControlGroup;
    private ngDatePickerTextControl: Control;
    private immediateFeedbackRequired: boolean;
    
    
    // For date picker control
    private date:Date;
    private initDate:Date;
    private showWeeks:boolean;
    private minDate:Date;
    private maxDate:Date;
    private hiddenFlag:boolean;
    private blurFlag:boolean;
    private dateChange:EventEmitter<{dateString:string, datePickerControl:Control, form:ControlGroup, date:Date}>;
    private datePickerWell:Element;
    
    constructor() {
        this.dateChange = new EventEmitter<{dateString:string, datePickerControl:Control, form:ControlGroup, date:Date}>();
    }
    
    ngOnInit(): void {
        
        this.controlName = this.datePickerConfig["controlName"] || "dateInput";
        this.date = new Date();
        this.date = this.datePickerConfig["initDate"] || this.date;
        this.datePickerConfig = this.datePickerConfig || {};
        this.dateFormat = this.datePickerConfig["dateFormat"] || "MM/DD/YYYY";
        this.helpText = this.datePickerConfig["helpText"] || "Enter date in " + this.dateFormat + " format";
        this.showWeeks = this.datePickerConfig["showWeeks"] || false;
        this.minDate = this.datePickerConfig["minDate"] || null;
        this.maxDate = this.datePickerConfig["maxDate"] || null;
        this.showHelpText = this.datePickerConfig["showHelpText"] ? this.datePickerConfig["showHelpText"]: false;
        this.hiddenFlag = true;
        this.blurFlag = true;
        this.disableTyping = this.datePickerConfig["disableTyping"] ? this.datePickerConfig["disableTyping"] : false;
        this.displayedText = this.helpText;
        this.displayedTextCssClass = false;
        this.immediateFeedbackRequired = this.datePickerConfig["immediateFeedbackRequired"] || false;
        this.ngDatePickerTextControl = new Control("", Validators.compose([
            this.dateControlValidator
        ]));
        
        if (this.datePickerConfig["form"] && this.datePickerConfig["form"] instanceof ControlGroup) {
            this.dateControlGroup = this.datePickerConfig["form"];
            
            if (this.controlName) {
               this.dateControlGroup.addControl(this.controlName,this.ngDatePickerTextControl); 
            } else {
                this.dateControlGroup.addControl("dateInput",this.ngDatePickerTextControl);
            }
            
        } else {
            this.dateControlGroup = new ControlGroup({
                dateInput: this.ngDatePickerTextControl
            });
            
            if (this.controlName) {
               this.dateControlGroup.removeControl("dateInput");
               this.dateControlGroup.addControl(this.controlName,this.ngDatePickerTextControl); 
            }
        }

        this.onDateChange();
    }
        
    onDateChange(): void {

        this.formattedDate = this.dateToFormattedDate(this.date, this.dateFormat);
        this.hiddenFlag = true;
        this.blurFlag = true;
        this.dateChange.emit({
            dateString: this.formattedDate,
            datePickerControl: this.ngDatePickerTextControl,
            form: this.dateControlGroup,
            date: this.date
        });
        
        //Since this event is triggered only when date is triggered via date picker control, we need to check for errors

       this.displayedTextCssClass = false;
       this.displayedText =  this.helpText;

    }
    
    dateToFormattedDate(date:Date,format:string): string {
        
        let formatTokens = format.split("/");
        let length = formatTokens.length;
        let formattedDate = "";
        let day = "";
        let month = "";
        let year = "";
        
        for (let i = 0; i < length; i += 1 ) {
            
            if (formatTokens[i].toUpperCase().trim() === "DD") {
                day = date.getDate().toString();
                if (day.length === 1) {
                    day = "0" + day;
                }
                
                if ( i < 2 ) {
                    formattedDate += day + "/";
                } else {
                    formattedDate += day;
                }
            } else if (formatTokens[i].toUpperCase().trim() === "MM") {
                month = String(date.getMonth() + 1);
                if (month.length === 1) {
                    month = "0" + month;
                }
                
                if ( i < 2 ) {
                    formattedDate += month + "/";
                } else {
                    formattedDate += month;
                }
            } else if (formatTokens[i].toUpperCase().trim() === "YYYY") {
                year = date.getFullYear().toString();
                if ( i < 2 ) {
                    formattedDate += year + "/";
                } else {
                    formattedDate += year;
                }
            }
        }
        return formattedDate;
    }
    
    onLostFocus(): void {
 
       this.hiddenFlag = this.blurFlag ? true : false;
       
       // Go ahead and check for validation errors and update css and help text accordingly
       this.prepareErrorFeedback();
    }
    
    onGotFocus(): void {
        this.hiddenFlag = false;
        this.displayedTextCssClass = (this.immediateFeedback && !this.ngDatePickerTextControl.valid) ? true : false;
        this.displayedText = this.helpText;

    } 
    
    onInputButtonClick(event){
        this.hiddenFlag = false;
        event.target.focus();
    }
    
    onIconClick(event): void {
        
        this.hiddenFlag = !this.hiddenFlag;
        this.datePickerTextControl = event.target.parentNode.getElementsByTagName("input")[0];
        this.datePickerTextControl.focus();
    }
    
    insertSlashAsPerFormat(event): any {
        
        this.blurFlag = true;
        
        if (! this.isDigit(event) ) {
            event.preventDefault();
            return false;
        }
        
        let textControl = event.target;
        let currentDateString = textControl.value;
        let formatTokens = this.dateFormat.split("/");
        let slashInsertPosition = [formatTokens[0].length, formatTokens[0].length + formatTokens[1].length + 1];
        
        if (currentDateString.length === slashInsertPosition[0] || currentDateString.length === slashInsertPosition[1]) {
            
            if (textControl.value[currentDateString.length - 1] !== "/") {
                textControl.value += "/";
            }
            
        }
    }
    
    immediateFeedback() {
        
        if (this.immediateFeedbackRequired) {
            this.prepareErrorFeedback();
        }
    }
    
    isDigit(event): boolean {
        
        let charCode = (event.which) ? event.which : event.keyCode;
        let dateTextTokens = event.target.value.split("");
        
        if (charCode > 31 && ((charCode < 48 || charCode > 57) || charCode === 8) && charCode !== 37
            && charCode !== 39 ) {
            
            let offendingChar = String.fromCharCode(charCode);            
            let index = dateTextTokens.indexOf(offendingChar);
            
            if ( index === -1 ) {
                index = dateTextTokens.indexOf(offendingChar.toLowerCase());
            }

            if ( index !== -1 ) {
                dateTextTokens.splice(index,1);
            }

            event.target.value = dateTextTokens.join("");
            return false;
        }
        return true;
    }
    
    isLeapYear(year): boolean {
        
        if ( Number(year) % 4 === 0 ) {
            
            if (Number(year) % 100 === 0) {
                
                if (Number(year) % 400 === 0) {
                    return true;
                } else {
                    return false;
                }
                
            } else {
                return true;
            }
            
        } else {
            return false;
        }
    }
    
    validateDate(dateString: string, dateFormat, errorObject ):boolean {
        
        errorObject["day"] = "";
        errorObject["month"] = "";
        errorObject["year"] = "";
        errorObject["invalidFormat"] = "";
        errorObject["rangeError"] = "";
        
        let dateTokens = dateString.split("/");
        let formatTokens = dateFormat.split("/");
        
        let indexOfYearToken = formatTokens.indexOf("YYYY");
        let year = Number(dateTokens[indexOfYearToken]);
        
        let indexOfMonthToken = formatTokens.indexOf("MM");
        let month = Number(dateTokens[indexOfMonthToken]);
        
        let indexOfDayToken = formatTokens.indexOf("DD");
        let day = Number(dateTokens[indexOfDayToken]);
        
        if (isNaN(year) || isNaN(month) || isNaN(day) ) {
            errorObject["invalidFormat"] = "Invalid date format. Please check the format";
            return false;            
        }
        
        let monthsWith30Days = [4,6,9,11];
        let monthsWith31Days = [1,3,5,8,10,12];
        
        if ( (dateTokens.length > 3) || !dateTokens[indexOfDayToken] || dateTokens[indexOfDayToken].length !== 2 ||
             !dateTokens[indexOfMonthToken] || dateTokens[indexOfMonthToken].length !== 2 || 
             !dateTokens[indexOfYearToken] || dateTokens[indexOfYearToken].length !== 4) {

            errorObject["invalidFormat"] = "Invalid date format. Please check the format";
            return false;
        }
        
        if ( year <= 0 ) {
            errorObject["year"] = "Year is invalid";
            return false;
        }
        
        if ( month > 0 && month < 13 ) {
            
            if ( (monthsWith31Days.indexOf(month) !== -1) && ( day < 1 || day > 31) ) {
                
                errorObject["day"] = "Day should be in the range 1 to 31 for the specified month";
                return false;
                
            } else if ( (monthsWith30Days.indexOf(month) !== -1) && ( day < 1 || day > 30) ) {
                errorObject["day"] = "Day should be in the range 1 to 30 for the specified month";
                return false;
                
            } else {
                
                if (this.isLeapYear(year) && (month) == 2) {
                    
                    if (day < 1 || day > 29) {
                        
                        errorObject["day"] = "Day should be in the range 1 to 29 for the specified month & year";
                        return false;
                        
                    } 
                } else if (!this.isLeapYear(year) && (month) == 2) {
                    
                    if (day < 1 || day > 28) {
                        
                        errorObject["day"] = "Day should be in the range 1 to 28 for the specified month & year";
                        return false; 
                    }
  
                }
            }
            
        } else {
            
            errorObject["month"] = " Month should be in the range 1 to 12";
            return false;
        }
        
        
        let validDate = new Date(month + "/" + day + "/" + year);
        
        if ( this.minDate && (validDate < this.minDate)) {
            errorObject["rangeError"] = "Date is less than the lowest permissible date";
            return false;
        } else if (( this.maxDate && (validDate > this.maxDate))) {
            
            errorObject["rangeError"] = "Date is greater than the highest permissible date";
            return false;
        }
        
        return true;
    }
    
    dateControlValidator = (control:Control) => {

        let errorObject = {};
        let dateString = control.value;
        
        if ( ! this.validateDate(dateString, this.dateFormat, errorObject)) {
            
            return errorObject;
        }
        
        return null;
    }
    
    prepareErrorFeedback():void {
        
      let errorText = "";

       for ( let key in this.ngDatePickerTextControl.errors) {
           errorText = (this.ngDatePickerTextControl.errors[key] === "" ) ? errorText: this.ngDatePickerTextControl.errors[key];
       }
       
       this.displayedText = (this.ngDatePickerTextControl.valid) ? this.helpText : errorText;
       
       if (this.displayedText === this.helpText ) {
           this.displayedTextCssClass = false;
       } else {
           this.displayedTextCssClass = true;
       }
       
       if (this.ngDatePickerTextControl.valid) {
           let dateTokens = this.formattedDate.split("/");
           let formatTokens = this.dateFormat.split("/");

           let indexOfYearToken = formatTokens.indexOf("YYYY");
           let year = Number(dateTokens[indexOfYearToken]);


           let indexOfMonthToken = formatTokens.indexOf("MM");
           let month = Number(dateTokens[indexOfMonthToken]);


           let indexOfDayToken = formatTokens.indexOf("DD");
           let day = Number(dateTokens[indexOfDayToken]);

           
           let validDate = new Date(month + "/" + day + "/" + year);
           this.date = validDate;
           
           this.displayedTextCssClass = false;
           
           this.dateChange.emit({
                dateString: this.formattedDate,
                datePickerControl: this.ngDatePickerTextControl,
                form: this.dateControlGroup,
                date: this.date
            });       
       }
    }

}