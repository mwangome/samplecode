/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
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
@Table(name = "account_transactions")
public class AccountTransactions implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @Column(name = "trans_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date transDate;
    
    @Column(name = "trans_ref")
    String transRef;
    
    @ManyToOne
    @JoinColumn(name = "account_id")
    Accounts account;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date createdAt;
    
    @Column(name = "is_active")
    boolean isActive;
    
    @Column(name = "debit")
    java.math.BigDecimal debit;
    
    @Column(name = "credit")
    java.math.BigDecimal credit;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }

    public Date getTransDate() {
        return transDate;
    }

    public void setTransDate(Date transDate) {
        this.transDate = transDate;
    }

    public Accounts getAccount() {
        return account;
    }

    public void setAccount(Accounts account) {
        this.account = account;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    } 

    public java.math.BigDecimal getDebit() {
        return debit;
    }

    public void setDebit(java.math.BigDecimal debit) {
        this.debit = debit;
    }

    public java.math.BigDecimal getCredit() {
        return credit;
    }

    public void setCredit(java.math.BigDecimal credit) {
        this.credit = credit;
    }

    public String getTransRef() {
        return transRef;
    }

    public void setTransRef(String transRef) {
        this.transRef = transRef;
    }
    
    
    
}
