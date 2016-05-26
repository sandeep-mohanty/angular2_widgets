import {Component, OnInit} from "@angular/core";
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
                maxlength = "10" 
                size="32" (click) = "hiddenFlag = false" 
                style="border-color:black; padding:5px;font-weight:bold;"
                (blur) = "closeControl()" 
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
                <span style= "width:270px;word-wrap: break-word; font-weight:bold">{{ (errorText) ? errorText : helpText}}</span>
            </span>
        </div><br/><br/>
    `,
    inputs:["datePickerConfig"],
    directives:[DATEPICKER_DIRECTIVES]
})
export class DatepickerComponent implements OnInit {
    
    // Config object for date picker control
    private datePickerConfig:any;
    
    // For date picker textbox
    private helpText:string;
    private errorText:string;
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
    
    constructor() {

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
        this.hiddenFlag = true;
        this.blurFlag = true;
        this.ngDatePickerTextControl = new Control("", Validators.compose([
            this.dateControlValidator
        ]));
        
        this.dateControlGroup = new ControlGroup({
            dateInput: this.ngDatePickerTextControl
        });
        this.onDateChange();
        console.log(this.ngDatePickerTextControl);
    }
        
    onDateChange(): void {
        this.formattedDate = this.dateToFormattedDate(this.date, this.dateFormat);
        this.hiddenFlag = true;
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
    
    closeControl(): void {
       
       this.hiddenFlag = this.blurFlag ? true : false;
       let errorText = "";

       for ( let key in this.ngDatePickerTextControl.errors) {
           errorText = this.ngDatePickerTextControl.errors[key];
       }
       this.errorText = (this.ngDatePickerTextControl.valid) ? "" : errorText;
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
        let slashInsertPosition = [formatTokens[0].length,formatTokens[0].length + formatTokens[1].length + 1];
        
        if (currentDateString.length === slashInsertPosition[0] || currentDateString.length === slashInsertPosition[1]) {
            textControl.value += "/";
        } 
    }
    
    isDigit(event): boolean {
        
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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
        
        let dateTokens = dateString.split("/");
        let formatTokens = dateFormat.split("/");
        
        let indexOfYearToken = formatTokens.indexOf("YYYY");
        let year = Number(dateTokens[indexOfYearToken]);
        
        let indexOfMonthToken = formatTokens.indexOf("MM");
        let month = Number(dateTokens[indexOfYearToken]);
        
        let indexOfDayToken = formatTokens.indexOf("DD");
        let day = Number(dateTokens[indexOfYearToken]);
        
        let monthsWith30Days = [4,6,9,11];
        let monthsWith31Days = [1,3,5,8,10,12];
        
        if ( month > 0 && month < 13 ) {
            
            if ( (monthsWith31Days.indexOf[month] !== -1) && ( day < 0 || day > 31) ) {
                
                errorObject["day"] = "Day should be in the range 1 to 31 for then specified month";
                return false;
                
            } else if ( (monthsWith30Days.indexOf[month] !== -1) && ( day < 0 || day > 30) ) {
                
                errorObject["day"] = "Day should be in the range 1 to 30 for then specified month";
                return false;
                
            } else {
                
                if (this.isLeapYear(year)) {
                    
                    if (day < 0 || day > 29) {
                        
                        errorObject["day"] = "Day should be in the range 1 to 29 for then specified month";
                        return false;
                        
                    } else {
                        errorObject["day"] = "Day should be in the range 1 to 28 for then specified month";
                        return false;                        
                    }
                }
            }
            
            return true;
            
        } else {
            
            errorObject["month"] = " Month should be in the range 1 to 12";
            return false;
        }
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