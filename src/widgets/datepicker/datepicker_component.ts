import {Component, OnInit} from "@angular/core";
import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: "custom-datepicker",
    template:`
        <div style="display:inline-block; min-height:290px; position: absolute;left: 50%; margin-left: -130px;">
            <input id = "widget_datepicker_text_control" type="text" 
                [placeholder]="dateFormat" 
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
                <span style= "width:270px;word-wrap: break-word; font-weight:bold">{{helpText}}</span>
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
    private dateFormat:string;
    private formattedDate:string;
    private datePickerTextControl:HTMLElement;
    private datePickerWidgetContainer:HTMLElement;
    private datePickerInnerContainer:Element;
    
    
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
        this.onDateChange();     
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
    
    closeControl() {
       this.hiddenFlag = this.blurFlag ? true : false;
    }
    
    onIconClick(event) {
        this.hiddenFlag = false;
        this.datePickerTextControl = event.target.parentNode.getElementsByTagName("input")[0];
        this.datePickerTextControl.focus();
    }
    
    insertSlashAsPerFormat(event){
        let textControl = event.target;
        let currentDateString = textControl.value;
        let formatTokens = this.dateFormat.split("/");
        let slashInsertPosition = [formatTokens[0].length,formatTokens[0].length + formatTokens[1].length + 1];
        
        if (currentDateString.length === slashInsertPosition[0] || currentDateString.length === slashInsertPosition[1]) {
            textControl.value += "/";
        } 
    }
    
}