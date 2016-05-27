import {Component} from "@angular/core";
import {Control, Validators, ControlGroup} from "@angular/common";
import {DatepickerComponent} from "../widgets/datepicker/datepicker_component";
import {DatepickerConfigInterface} from "../widgets/datepicker/datepicker_config_interface";


@Component({
    selector: "app",
    template: `
        <div align="center" [ngStyle]= "{'color' : color, 'background-color':backgroundColor}" >
            <h1>{{title}}</h1>
        </div>
        <br/>
        <div align="center"><h2>{{datePickerTitle}}</h2></div> <br/>
        <div style="display:inline-block; min-height:290px; position: absolute;left: 50%; margin-left: -130px;">
            <label>Due Date for Form Submission</label>
        </div><br/>
        <custom-datepicker [datePickerConfig] = "datePickerConfig" (dateChange) = "showDateChangeResult($event)" ></custom-datepicker>
    `,
    directives:[DatepickerComponent]
})

export class Demo_App {
    
    private title:string;
    private color:string;
    private backgroundColor:string;
    
    // Date picker properties
    private datePickerTitle:string;
    private datePickerConfig:DatepickerConfigInterface;

    
    constructor() {
        this.title = "Welcome To Angular2 Widgets";
        this.color = "white";
        this.backgroundColor = "green";
        
        // Date picker properties
        this.datePickerTitle = "Date Picker";
        this.datePickerConfig = {};
        this.datePickerConfig["helpText"] = "";
        this.datePickerConfig["dateFormat"] = "DD/MM/YYYY";
        this.datePickerConfig["initDate"] = new Date("12/31/2016");
        this.datePickerConfig["showWeeks"] = false;
        this.datePickerConfig["minDate"] = new Date("09/27/2012");
        this.datePickerConfig["maxDate"] = new Date("01/31/2017");
        this.datePickerConfig["showHelpText"] = true;
        
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