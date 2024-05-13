import { isPlatform } from "@ionic/angular/standalone"

export function isAMobileDevice() {
    return isPlatform('ios') ||
        isPlatform('android') || 
        isPlatform('capacitor') || 
        isPlatform('cordova') || 
        isPlatform('mobile'); 
}