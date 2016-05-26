import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from "@angular/http";
import {ROUTER_PROVIDERS} from "@angular/router";
import {Demo_App} from "./demoapp";

bootstrap(Demo_App,[HTTP_PROVIDERS]);
