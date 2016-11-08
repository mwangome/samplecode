/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.enumerate;

/**
 *
 * @author mwangome
 */
public enum Modules {
    LOAN_CENTER("Loan Center"),
    ACCOUNTS("Accounts");
    
    String description;
    
    Modules module;
    
    Modules(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public static String[] getModuleDescriptions(){
        Modules[] values = Modules.values();
        String descs[] = new String[values.length];
        int counter = 0;
        for(Modules mod:values){
            descs[counter] = mod.getDescription();
            counter++;
        }
        return descs;
    }
    
    public static Modules getModule(String description){
        Modules[] values = Modules.values();
        for(Modules mod:values){
            if(description.equalsIgnoreCase(mod.getDescription())){
                return mod;
            }
        }
        return null;
    }
       
   

     public static void main(String args[]){
        String mods[] = getModuleDescriptions();
        System.out.println(getModule("Loan Center"));
    }
}
