import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    sharedData: number = 0;
}