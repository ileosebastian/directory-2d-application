import { isPlatform } from "@ionic/angular/standalone";

/*
* return void
*/
/**
 * Show all platform that execute app depending of device
 * @returns void
 */
export const whatPlatformIsIt = () => {
    if (isPlatform('android')) console.log('is android');
    if (isPlatform('capacitor')) console.log('is capacitor');
    if (isPlatform('cordova')) console.log('is cordova');
    if (isPlatform('desktop')) console.log('is desktop');
    if (isPlatform('electron')) console.log('is electron');
    if (isPlatform('hybrid')) console.log('is hybrid');
    if (isPlatform('ios')) console.log('is ios');
    if (isPlatform('ipad')) console.log('is ipad');
    if (isPlatform('iphone')) console.log('is iphone');
    if (isPlatform('mobile')) console.log('is mobile');
    if (isPlatform('mobileweb')) console.log('is mobileweb');
    if (isPlatform('phablet')) console.log('is phablet');
    if (isPlatform('pwa')) console.log('is pwa');
    if (isPlatform('tablet')) console.log('is tablet');
}
