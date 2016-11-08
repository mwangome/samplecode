/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 *
 * @author derek
 */ 
@Entity
@Table(name = "accounts")
public class RealAccounts implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "account_number")
    Integer accountNumber;
    
    @Column(name = "code")
    String code;
    
    @Column(name = "account_name")
    String accountName;
    
    @OneToMany(mappedBy = "realAccount")
    java.util.Set<NorminalAccounts> norminalAccounts;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(Integer accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Set<NorminalAccounts> getNorminalAccounts() {
        return norminalAccounts;
    }

    public void setNorminalAccounts(Set<NorminalAccounts> norminalAccounts) {
        this.norminalAccounts = norminalAccounts;
    }

    
}
