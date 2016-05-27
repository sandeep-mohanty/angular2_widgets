import {Component, OnInit, EventEmitter} from "@angular/core";
import {Control, Validators, ControlGroup} from "@angular/common";
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: "custom-datepicker",
    template:`
        <div [ngFormModel] = "dateControlGroup" style="display:inline-block; min-height:290px; position: absolute;left: 50%; margin-left: -130px;">
            <input id = "widget_datepicker_text_control" type="text" 
                [placeholder]="dateFormat" 
                [ngFormControl] = "dateControlGroup.controls['dateInput']"
                [(ngModel)] = "formattedDate"
                [class.error] = "displayedTextCssClass" 
                maxlength = "10" 
                size="32" 
                (click) = "hiddenFlag = false" 
                style="padding:5px;font-weight:bold;"
                [style.border-color] = "!displayedTextCssClass ? 'black' : 'red'"
                (blur) = "onLostFocus()"
                (focus) = "onGotFocus()"
                (keyup) = "insertSlashAsPerFormat($event)">

            <img src = "../../../assets/images/datepicker/datepicker.png" (click) = "onIconClick($event)">
        </div><br/><br/>
        <div style="display:inline-block; min-height:290px; position: absolute;left: 50%; margin-left: -130px;">
            <span id="widget_datepicker_control_container" (mousedown) = "blurFlag = false" (mouseout) = "blurFlag = true">
                <span [hidden] = "hiddenFlag">
                    <datepicker [(ngModel)]="date" 
                        (ngModelChange) = "onDateChange()" 
                        [showWeeks]="showWeeks" 
                        [minDate] = "minDate" 
                        [maxDate] = "maxDate" >
                    </datepicker>
                </span>
                <span style= "width:270px;word-wrap: break-word; font-weight:bold;"
                    [class.error] = "displayedTextCssClass"
                    *ngIf = "showHelpText"
                >
                    {{displayedText}}
                </span>
            </span>
        </div><br/><br/>
    `,
    styleUrls: ["../../assets/css/widgets/datepicker/datepicker.css"],
    inputs: ["datePickerConfig"],
    outputs: ["dateChange"],
    directives: [DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent implements OnInit {
    
    // Config object for date picker control
    private datePickerConfig:any;
    
    // For date picker textbox
    private helpText:string;
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
    
    
    // For date picker control
    private date:Date;
    private initDate:Date;
    private showWeeks:boolean;
    private minDate:Date;
    private maxDate:Date;
    private hiddenFlag:boolean;
    private blurFlag:boolean;
    private dateChange:EventEmitter<{dateString:string, datePickerControl:Control, date:Date}>;
    
    constructor() {
        this.dateChange = new EventEmitter<{dateString:string, datePickerControl:Control, date:Date}>();
    }
    
    ngOnInit(): void {
 
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
        this.displayedText = this.helpText;
        this.displayedTextCssClass = false;
        this.ngDatePickerTextControl = new Control("", Validators.compose([
            this.dateControlValidator
        ]));
        
        
        if (this.datePickerConfig["form"] && this.datePickerConfig["form"] instanceof ControlGroup) {
            this.dateControlGroup = this.datePickerConfig["form"];
            this.dateControlGroup.addControl("dateInput",this.ngDatePickerTextControl);
        } else {
            this.dateControlGroup = new ControlGroup({
                dateInput: this.ngDatePickerTextControl
            });
        }

        
        this.onDateChange();
    }
        
    onDateChange(): void {
        console.log(this.date);
        this.formattedDate = this.dateToFormattedDate(this.date, this.dateFormat);
        this.hiddenFlag = true;
        this.dateChange.emit({
            dateString: this.formattedDate,
            datePickerControl: this.ngDatePickerTextControl,
            date:this.date
        });
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
           
           this.dateChange.emit({
                dateString: this.formattedDate,
                datePickerControl:this.ngDatePickerTextControl,
                date: this.date
            });       
       }
    }
    
    onGotFocus(): void {

        this.displayedTextCssClass = false;
        this.displayedText = this.helpText;
    }
    
    onIconClick(event): void {
        this.hiddenFlag = false;
        this.datePickerTextControl = event.target.parentNode.getElementsByTagName("input")[0];
        this.datePickerTextControl.focus();
    }
    
    insertSlashAsPerFormat(event): any {

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
    
    isDigit(event): boolean {
        
        let charCode = (event.which) ? event.which : event.keyCode;
        let dateTextTokens = event.target.value.split("");
        
        if (charCode > 31 && (charCode < 48 || charCode > 57) || charCode === 8) {
            
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
        
        let monthsWith30Days = [4,6,9,11];
        let monthsWith31Days = [1,3,5,8,10,12];
        
        if ( (dateTokens.length > 3) || !dateTokens[indexOfDayToken] || dateTokens[indexOfDayToken].length !== 2 ||
             !dateTokens[indexOfMonthToken] || dateTokens[indexOfMonthToken].length !== 2 || 
             !dateTokens[indexOfYearToken] || dateTokens[indexOfYearToken].length !== 4) {

            errorObject["invalidFormat"] = "Invalid Format. Please check the format";
            return false;
        }
        
        if ( year <= 0 ) {
            errorObject["year"] = "Year is invalid";
            return false;
        }
        
        if ( month > 0 && month < 13 ) {
            
            if ( (monthsWith31Days.indexOf(month) !== -1) && ( day < 0 || day > 31) ) {
                
                errorObject["day"] = "Day should be in the range 1 to 31 for the specified month";
                return false;
                
            } else if ( (monthsWith30Days.indexOf(month) !== -1) && ( day < 0 || day > 30) ) {
                errorObject["day"] = "Day should be in the range 1 to 30 for the specified month";
                return false;
                
            } else {
                
                if (this.isLeapYear(year) && (month) == 2) {
                    
                    if (day < 0 || day > 29) {
                        
                        errorObject["day"] = "Day should be in the range 1 to 29 for the specified month & year";
                        return false;
                        
                    } 
                } else if (!this.isLeapYear(year) && (month) == 2) {
                    
                    if (day < 0 || day > 28) {
                        
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
            errorObject["rangeError"] = "Date is lower than the lower permissible range";
            return false;
        } else if (( this.maxDate && (validDate > this.maxDate))) {
            
            errorObject["rangeError"] = "Date is higher than the higher permissible range";
            return false;
        }
        
        return true;
    }
    
    dateControlValidator = (control:Control) => {

        let errorObject = {};
        let dateString = control.value;
        
        if (dateString.length < 0 || dateString.length > 10 ){
            return errorObject["length"] = "Invalid Date string length";
        }
        
        if ( ! this.validateDate(dateString, this.dateFormat, errorObject)) {
            
            return errorObject;
        }
        
        return null;
    }
    
}