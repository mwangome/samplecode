/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "SME_Banks")
public class Bank implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "bank_code")
    String bankCode;
    
    @Column(name = "bank_name")
    String bankName;
    
    @Column(name = "bank_town_id")
    String bankTownId;
    
    @Column(name = "postalCode")
    String postalCode;
    
    @Column(name = "postal_number")
    String postalNumber;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date createdAt;
    
    @Column(name = "created_by")
    String createdBy;
    
    @OneToMany(mappedBy = "bank")
    java.util.Set<BankBranch> branches;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankTownId() {
        return bankTownId;
    }

    public void setBankTownId(String bankTownId) {
        this.bankTownId = bankTownId;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPostalNumber() {
        return postalNumber;
    }

    public void setPostalNumber(String postalNumber) {
        this.postalNumber = postalNumber;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Set<BankBranch> getBranches() {
        return branches;
    }

    public void setBranches(Set<BankBranch> branches) {
        this.branches = branches;
    }
    
    
    
}
