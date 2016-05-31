import {Component,EventEmitter} from "@angular/core";

@Component({
    selector: "widget-selection",
    templateUrl:"../../assets/templates/config/widget_selection.html",
    inputs:["widgetList"],
    outputs:["selectionChange"],
    styleUrls:["../../assets/css/config/widget_selection.css"]
})

export class WidgetSelectionComponent{
    
    private _title:string;
    private widgetList:boolean[];
    private selectionChange:EventEmitter<boolean[]>;
    
    constructor(){
        this._title = "Widget Selection Panel";
        this.selectionChange = new EventEmitter<boolean[]>();
    }
    
    widgetSelectionChange(event) {
        this.selectionChange.emit(event.target.value);
    }
}