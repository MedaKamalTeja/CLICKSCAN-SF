import { LightningElement } from 'lwc';
import logo from '@salesforce/resourceUrl/clickScan';
export default class DrawerManagement extends LightningElement {
    fieldTypeOptions = [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Date', value: 'date' }
    ];
    logoUrl = logo;
}