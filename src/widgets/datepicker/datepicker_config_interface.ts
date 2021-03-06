import {ControlGroup} from "@angular/common";

export interface DatepickerConfigInterface{
   
   controlName ?: string; // The name of the date control
   initDate ?: Date; // The initial value of the datepicker control. Default value is current date.
   disableTyping ?: boolean; // Whether manually typing of date should be allowed. 
   dateFormat ?: string; // Date format for the datepicker control. Default format is "MM/DD/YYYY".
   helpText ?: string; // Help text for user. Default value is "Enter date in the specified format".
   minDate ?: Date; // Minimum allowable date for the date picker control.
   maxDate ?: Date; // Maximum allowable date for the date picker control.
   showWeeks ?: boolean; // Whether to show weeks in the date picker control. Default is false.
   showHelpText ?: boolean; // Whether help text needs to be shown.
   form ?: ControlGroup; // The control group to which the datepicker control needs to be added.
   immediateFeedbackRequired: boolean // If true, the date entered in textboc gets validated on each keypress
}