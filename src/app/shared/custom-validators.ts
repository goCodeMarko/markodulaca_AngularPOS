import { AbstractControl } from "@angular/forms";

export class CustomValidators {

    static higherThanMax(maxQty: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const qty: number = control.value;

            if (qty <= maxQty) {
                return null;
            } else if (qty > maxQty) {
                return { 'higherThanMax': true };
            }

        }
    }

    static qtyZero() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const qty: number = control.value;

            if (qty == 0) {
                return { 'qtyZero': true };
            }

        }
    }

    static insufficientCash(toPay) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const cash: number = control.value;

            if (cash < toPay && cash || cash == 0) {
                return { 'insufficientCash': true };
            }
        }
    }

}