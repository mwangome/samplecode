/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "norminal_account")
public class NorminalAccounts implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "account_class")
    String accountClass;
    
    @Column(name = "code")
    String  code;
    
    @Column(name = "account_name")
    String accountName;
    
    @Column(name = "description")
    String description;
    
    @Column(name = "account_number")
    String accountNumber;
    
    @ManyToOne
    @JoinColumn(name = "account_id")
    RealAccounts realAccount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountClass() {
        return accountClass;
    }

    public void setAccountClass(String accountClass) {
        this.accountClass = accountClass;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public RealAccounts getRealAccount() {
        return realAccount;
    }

    public void setRealAccount(RealAccounts realAccount) {
        this.realAccount = realAccount;
    }
    
    
}
