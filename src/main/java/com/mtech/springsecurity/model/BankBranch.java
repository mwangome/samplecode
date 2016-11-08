/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "bank_branches")
public class BankBranch implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "branch_code")
    String branchCode;
    
    @Column(name = "branch_name")
    String branchName;
    
    @Column(name = "branch_town_id")
    String branchTownId;
    
    @Column(name = "postal_code")
    String postalCode;
    
    @Column(name = "postal_number")
    String postalNumber;
    
    @Column(name = "building")
    String building;
    
    @Column(name = "street")
    String street;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date createdAt;
    
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_id")
    Bank bank;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getBranchTownId() {
        return branchTownId;
    }

    public void setBranchTownId(String branchTownId) {
        this.branchTownId = branchTownId;
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

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }  
    
}
