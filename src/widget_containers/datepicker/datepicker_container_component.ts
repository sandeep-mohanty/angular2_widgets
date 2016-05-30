import {Component} from "@angular/core";
import {Control, Validators, ControlGroup,FORM_DIRECTIVES} from "@angular/common";
import {DatepickerComponent} from "../../widgets/datepicker/datepicker_component";
import {DatepickerConfigInterface} from "../../widgets/datepicker/datepicker_config_interface";

@Component({
    
    selector: "datepicker-container",
    templateUrl: "../../../assets/templates/widget_containers/datepicker/datepicker_container.html",
    styleUrls: ["../../../assets/css/widget_containers/datepicker/datepicker_container.css"],
    directives: [DatepickerComponent,FORM_DIRECTIVES]
})

export class DatepickerContainerComponent {

    // Date picker properties
    private datePickerTitle:string;
    private datePickerConfig:DatepickerConfigInterface;

    
    constructor() {

        // Date picker properties
        this.datePickerTitle = "Date Picker Widget";
        this.datePickerConfig = {
            
            initDate: null,
            dateFormat: "", 
            helpText:"",
            minDate: null,
            maxDate: null,
            showWeeks: false,
            showHelpText: true,
            form: null,
            immediateFeedbackRequired: false
        };
        this.datePickerConfig["helpText"] = "";
        this.datePickerConfig["dateFormat"] = "MM/DD/YYYY";
        this.datePickerConfig["initDate"] = new Date("12/31/2016");
        this.datePickerConfig["showWeeks"] = false;
        this.datePickerConfig["minDate"] = new Date("09/27/1970");
        this.datePickerConfig["maxDate"] = new Date("01/31/2025");
        this.datePickerConfig["showHelpText"] = true;
        this.datePickerConfig["immediateFeedbackRequired"] = false;
        
        let testControl = new Control("",Validators.required);
        this.datePickerConfig["form"] = new ControlGroup({
            testControl: testControl
        });
        
    }
    
    showDateChangeResult(data) {
        console.dir(data);
        console.dir(this.datePickerConfig["form"]);
    }
    
}