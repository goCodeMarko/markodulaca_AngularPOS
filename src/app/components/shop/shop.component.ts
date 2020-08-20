import { IfStmt } from '@angular/compiler';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionService } from "../../services/transaction/transaction.service";
import { CustomValidators } from "../../shared/custom-validators";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {
  public cart: any[] = [];
  public itemVoid: any[] = [];
  public transaction: any[] = [];
  public checkoutClicked: boolean;

  public tax: number = 0.12;
  public discountPercentage: number = 0.20;
  public rbtnResult = "regular";
  public removeItem: any[] = [];

  private changed: number = 0;
  private cash: number = 0;
  private catchSubTotal: number;
  private grandTotal: number;
  private vat: number;
  private totalDiscount: number = 0;
  checkOutFormReference: any;
  receiptFormReference: any;

  public checkOutForm: FormGroup
  public validationMessages: object = {
    'cash': {
      'required': 'Excuse me! I\'m required.',
      'insufficientCash': 'Wait, That Cash is Insufficient.'
    }
  }
  public formErrors: object = {
    'cash': ''
  }

  constructor(private _transactionService: TransactionService,
    private _ngbModal: NgbModal,
    private _activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {


  }

  openCheckoutModal(targetModal) {
    this.checkoutClicked = true

    // checkOutForm form builder
    this.checkOutForm = this._formBuilder.group({
      cash: ['', [Validators.required, CustomValidators.insufficientCash(this.getGrandTotal())]]
    });

    // Opens the modal.
    this.checkOutFormReference = this._ngbModal.open(targetModal, {
      backdrop: 'static',
      keyboard: false
    });

    this.checkOutForm.patchValue({
      cash: this.getGrandTotal()
    })
  }

  calculate(): void {
    //OOP Encapsulation Principle
    this.setSubTotal();
    this.setChargeTax(this.tax);
    this.setGrandTotal();
    this.setDiscount(this.discountPercentage, this.rbtnResult);

  }

  //Setters
  private setSubTotal(): void {
    //Adding each prices of the item in the cart.
    this.catchSubTotal = this.cart.reduce((prev, current) => {
      let result = prev + current.subTotal;
      return parseFloat(result.toFixed(2))

    }, 0)
  }

  private setChargeTax(tax): void {
    //Calculates the VAT.
    let result = this.catchSubTotal * tax;

    this.vat = parseFloat(result.toFixed(2));

    //Calculates the sub total and adding the calculated vat.
    this.grandTotal = this.catchSubTotal + this.vat;
  }

  private setGrandTotal(): void {
    //Calculates the sub total and adding the calculated vat.
    this.grandTotal = this.catchSubTotal + this.vat;
  }

  private setDiscount(discount, rbtnResult) {
    if (rbtnResult == "sc_pwd") {
      //Calculates total discount.
      this.totalDiscount = this.grandTotal * discount;

      this.grandTotal -= this.totalDiscount;
    } else {
      //Calculates previous total if no discount detected.
      this.grandTotal = this.catchSubTotal + this.vat

      //Sets the total discount to zero.
      this.totalDiscount = 0;
    }
  }

  private setChange(cash, total) {
    let result = cash - total;

    this.changed = parseFloat(result.toFixed(2));
  }

  private setCash(cash) {

    this.cash = parseFloat(cash.toFixed(2));

  }

  //Getters
  getSubtotal() { //Gets the subtotal.
    return parseFloat(this.catchSubTotal.toFixed(2));
  }

  getChargeTax() { //Gets the tax.
    return parseFloat(this.vat.toFixed(2));
  }

  getDiscount() { //Gets the discount.
    return parseFloat(this.totalDiscount.toFixed(2));
  }

  getGrandTotal() { //Gets the total.
    return parseFloat(this.grandTotal.toFixed(2));
  }

  getChanged() { //Gets the change.
    return parseFloat(this.changed.toFixed(2));
  }

  getCash() { //Gets the change.

    return parseFloat(this.cash.toFixed(2));
  }

  openVoidItemConfirmation(index, id, prodName, targetModal) {
    // Opens the modal.
    this._ngbModal.open(targetModal, {
      backdrop: 'static',
      keyboard: false
    });

    // Pushes the selected data into the removeItem array.
    this.removeItem.push({
      index: index,
      id: id,
      prodName: prodName
    });

  }

  remove(): void {

    let id = this.removeItem[0]["id"];
    let index = this.removeItem[0]["index"];

    /*Filters the cart using the id then setting the itemVoid array
     equal to filtered value and sends this data to the children
     to make the quantity back to the previous value.*/
    this.cart.filter(val => {

      if (val.id == id) {

        this.itemVoid = [val]
      }
    })

    //Removing the selected object from the cart array,
    this.cart.splice(index, 1);

    // Clears the removeItem array
    this.removeItem = [];
  }

  openVoidAllItemConfirmation(targetModal) {
    // Opens the modal.
    this._ngbModal.open(targetModal, {
      backdrop: 'static',
      keyboard: false
    });

  }

  removeAll(items) {

    //Sets the objects of cart and to be pass to children component.
    this.itemVoid = items

    //Clears the cart array.
    this.cart = [];
  }


  rbtnChange(value) {
    //Everytime radio button changes the data would update.
    this.rbtnResult = value;
  }

  cashKeypress(event) {
    // Disables the keys.
    if (event.key == "e" || event.key == "-" || event.key == "+") {
      event.preventDefault();
    }
  }

  logValidationErrors(group: FormGroup = this.checkOutForm) {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {

          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
    })
  }

  checkOut(cash, cart, subtotal, vat, totalDiscount, total, targetModal) {

    let changed: number;
    let account: object = JSON.parse(localStorage.getItem('account'));

    this.transaction = [];

    // Calls the setChange method.
    this.setChange(cash.cash, total);

    this.setCash(cash.cash);

    // Calls the getChange then assignig to the changed variable.
    changed = this.getChanged();

    // Pushes the data into the transaction array.
    this.transaction.push(
      {
        user: account["_id"],
        products: cart,
        vatableSales: subtotal,
        vatAmount: vat,
        discount: totalDiscount,
        grandTotal: total,
        cash: cash.cash,
        changed: changed
      }
    );

    // Calls the service.
    this._transactionService.addTransaction(this.transaction[0]).subscribe(data => {

      if (data["success"] == true) {
        this.checkOutFormReference.close();

        this.receiptFormReference = this._ngbModal.open(targetModal, {
          backdrop: 'static',
          keyboard: false
        });
      }

    });

  }

  resetCart() {
    this.cart = []; // resets the cart array

    this.checkoutClicked = false
  }

}
