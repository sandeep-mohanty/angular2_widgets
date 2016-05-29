import {Component} from "@angular/core";
import {Control, Validators, ControlGroup} from "@angular/common";
import {DatepickerContainerComponent} from "../widget_containers/datepicker/datepicker_container_component";
import {DatepickerConfigInterface} from "../widgets/datepicker/datepicker_config_interface";


@Component({
    selector: "app",
    template: `
        <div align="center" [ngStyle]= "{'color' : color, 'background-color':backgroundColor}" >
            <h1>{{title}}</h1>
        </div>
        <br/>
        <datepicker-container></datepicker-container>
    `,
    directives:[DatepickerContainerComponent]
})

export class Demo_App {
    
    private title:string;
    private color:string;
    private backgroundColor:string;

    constructor() {
        this.title = "Welcome To Angular2 Widgets";
        this.color = "white";
        this.backgroundColor = "green";
        
    }

}