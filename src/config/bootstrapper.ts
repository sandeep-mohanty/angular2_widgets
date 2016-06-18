import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from "@angular/http";
import {ROUTER_PROVIDERS} from "@angular/router";
import {Demo_App} from "./demoapp";
//import {enableProdMode} from '@angular/core';

//enableProdMode();
bootstrap(Demo_App,[HTTP_PROVIDERS]);
