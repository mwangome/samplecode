/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.enumerate;

import java.util.ArrayList;

/**
 *
 * @author mwangome
 */
public enum FinancialTransactions {
    CASH_DEPOSIT ("Cash Deposit"),
    CASH_WITHDRAWAL ("Cash Withdrawal"),
    BANK_DEPOSIT ("Bank Deposit"),
    BANK_WITHDRAWAL ("Bank Withdrawal"),
    MOBILE_DEPOSIT("Mobile Deposit"),
    MOBILE_WITHDRAWAL("Mobile Withdrawal");
    
    String description;
    FinancialTransactions(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
   
    
    public static Object[] getTransactions(String filter){
        FinancialTransactions[] values = FinancialTransactions.values();
        ArrayList<FinancialTransactions> aList = new ArrayList();
        for(FinancialTransactions ft:values){
            //if(ft.getDescription().contains(filter)){
                aList.add(ft);
            //}
        }
        return aList.toArray();
    }
    
    public static void main(String[] args){
        Object[] bankTransactions = FinancialTransactions.getTransactions("Mobile");
        for(Object o: bankTransactions){
            System.out.println(((FinancialTransactions)o).getDescription());
        }
    }
    
}
