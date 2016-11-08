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
public enum PaymentModes {
    CASH ("Cash"), 
    Bank ("Bank"),
    CREDIT ("Credit"),
    MOBILE ("Mobile Money");
    
    String description;
    PaymentModes(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public static PaymentModes getMode(String description){
        PaymentModes[] values = PaymentModes.values();
        for(PaymentModes pm:values){
            if(pm.getDescription().equalsIgnoreCase(description)){
                return pm;
            }
        }
        return null;
    }
}
