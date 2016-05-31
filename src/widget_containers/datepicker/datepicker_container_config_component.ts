import {Component, EventEmitter} from "@angular/core";
import {DatepickerConfigInterface} from "../../widgets/datepicker/datepicker_config_interface";

@Component({
    selector: "datepicker-config",
    templateUrl: "../../../assets/templates/widget_containers/datepicker/datepicker_config.html",
    outputs:["configSubmit"],
    styleUrls:["../../../assets/css/widget_containers/datepicker/datepicker_config.css"]
})

export class DatePickerConfigComponent {
    
    private configSubmit: EventEmitter<DatepickerConfigInterface>;
    private _show_hide_config: boolean;
    
    constructor() {
        this._show_hide_config = false;
    }
    
    showHideConfig(){
        this._show_hide_config = !this._show_hide_config;
    }
}