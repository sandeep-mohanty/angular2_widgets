import {Component, EventEmitter} from "@angular/core";
import {DatepickerConfigInterface} from "../../widgets/datepicker/datepicker_config_interface";

@Component({
    selector: "datepicker-config",
    templateUrl: "../../../assets/templates/widget_containers/datepicker/datepicker_config.html",
    inputs:["configuration:datePickerConfig"],
    outputs:["configSubmit"],
    styleUrls:["../../../assets/css/widget_containers/datepicker/datepicker_config.css"]
})

export class DatePickerConfigComponent {
    
    private configSubmit: EventEmitter<DatepickerConfigInterface>;
    private _show_hide_config: boolean;
    private configModel:any;
    private configuration:DatepickerConfigInterface;
    
    constructor() {
        this._show_hide_config = false;
        this.configSubmit = new EventEmitter<DatepickerConfigInterface>();
    }
    
    showHideConfig(){
        this._show_hide_config = !this._show_hide_config;
    }
    
    applySettings(configurations){
        this.configuration.initDate = this.dateStringToDateObject(configurations.initDate, "MM/DD/YYYY");
        this.configuration.minDate = this.dateStringToDateObject(configurations.minDate, "MM/DD/YYYY");
        this.configuration.maxDate = this.dateStringToDateObject(configurations.maxDate, "MM/DD/YYYY");
        this.configuration.dateFormat = configurations.dateFormat;
        this.configuration.showHelpText = configurations.showHelpText;
        this.configuration.immediateFeedbackRequired = configurations.immediateFeedbackRequired;
        this.configuration.showWeeks = configurations.showWeeks;
        this.configuration.helpText = configurations.helpText;
        this.configuration.disableTyping = configurations.disableTyping;
        this.configSubmit.emit(this.configuration);
    }
    
    dateStringToDateObject(dateString:string, dateFormat:string):Date{
        
        if (!dateString) {
            return null;
        }
        let dateTokens = dateString.split("/");
        let formatTokens = dateFormat.split("/");

        let indexOfYearToken = formatTokens.indexOf("YYYY");
        let year = Number(dateTokens[indexOfYearToken]);


        let indexOfMonthToken = formatTokens.indexOf("MM");
        let month = Number(dateTokens[indexOfMonthToken]);


        let indexOfDayToken = formatTokens.indexOf("DD");
        let day = Number(dateTokens[indexOfDayToken]);

        
        let validDate = new Date(month + "/" + day + "/" + year);
        return validDate;
    }

}