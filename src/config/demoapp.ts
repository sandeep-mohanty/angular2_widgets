import {Component, OnInit} from "@angular/core";
import {Control, Validators, ControlGroup} from "@angular/common";
import {WidgetSelectionComponent} from "./widget_selection";
import {DatepickerContainerComponent} from "../widget_containers/datepicker/datepicker_container_component";
import {DatepickerConfigInterface} from "../widgets/datepicker/datepicker_config_interface";


@Component({
    selector: "app",
    templateUrl: "../../assets/templates/config/app.html",
    directives:[DatepickerContainerComponent,WidgetSelectionComponent]
})

export class Demo_App implements OnInit {
    
    private title:string;
    private color:string;
    private backgroundColor:string;
    private _widgetList:boolean[];

    constructor() {
        this.title = "Angular2 UI Control Components";
        this.color = "white";
        this.backgroundColor = "green";
        this._widgetList = [];
    }
    
    ngOnInit(){
        this._widgetList['datepicker'] =  false;
    }
    
    updateSelection(widget){
        this._widgetList[widget] = !this._widgetList[widget];
    }

}