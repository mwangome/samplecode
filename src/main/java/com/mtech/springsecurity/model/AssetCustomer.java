/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import com.mtech.springsecurity.model.Customer;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "sme_customers")
@DiscriminatorValue("ASSET_CUSTOMER")
public class AssetCustomer extends Customer{
    @Column(name = "customer_type")
    String customerType;

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }
    
}
