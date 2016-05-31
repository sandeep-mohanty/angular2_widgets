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
}