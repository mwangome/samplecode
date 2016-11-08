
package com.mtech.springsecurity.enumerate;

/**
 *
 * @author mwangome
 */
public enum TaxTypes {
    VAT ("VAT"), 
    CORPORATE ("Corporate");
    
    String description;
    
    TaxTypes(String description){
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    
}
