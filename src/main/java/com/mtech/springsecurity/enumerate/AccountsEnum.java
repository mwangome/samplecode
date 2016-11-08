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
public enum AccountsEnum {
    /**
     * Balance sheet Accounts
     */
    ASSETS(1000, "Assets"),
    LIABILITIES(2000, "Liabilities"),
    STOCKHOLDERS_EQUITY(2100, "Owners/Stockholders' Equity"),
    
    /**
     * Income statement accounts
     */
    OPERATING_REVENUES(3000,"Operating Revenues"),
    OPERATING_EXPENSES(3100, "Operating Expenses"),
    NON_OPERATING_REVENUES_GAINS(3200, "Non-operating Revenues and Gains"),
    NON_OPERATING_EXPENSES_LOSSES(3300, "Non-operating Expenses and Losses");
    
    String description;
    Integer code;
    AccountsEnum(Integer code, String description){
        this.description = description;
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
    
    public static AccountsEnum[] getAccountsEnum(){
        return AccountsEnum.values();
    }
    
    public static void main(String args[]){
        AccountsEnum[] accountsEnum = AccountsEnum.getAccountsEnum();
        for(AccountsEnum ae:accountsEnum){
            System.out.println(ae.getCode() + "=>" + ae.getDescription());
        }
    }
    
}
