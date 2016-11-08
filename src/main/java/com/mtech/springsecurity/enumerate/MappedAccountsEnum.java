/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.enumerate;

/**
 *
 * @author derek
 */
public enum MappedAccountsEnum {
    Purchases("Purchases"),
    Creditors("Creditors"),
    Cash("Cash"),
    Mobile("Mobile Money"),
    Bank ("Bank"),
    Debtors("Debtors"),
    Sales("Sales"),
    
    Gain("Gain on Disposal"),
    Loss("Loss on Disposal"),
    
    FixedAssets("Fixed Assets"),
    
    Tax("Tax"),
    Prepayments ("Prepayments"),
    Freight_In("Carriage Inwards"),
    Accruals("Accruals"),
    
    Depreciation("Accumulated Depreciation");
    
    String description;
    
    MappedAccountsEnum(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public static void main(String args[]){
        System.out.println(MappedAccountsEnum.FixedAssets.getDescription());
    }
}
