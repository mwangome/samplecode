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
import javax.persistence.TemporalType;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "payments")
public class Payment implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @ManyToOne
    @JoinColumn(name = "invoice_ref")
    Purchase purchase;
    
    /**
     * Payment for account other than purchase
     */
    @ManyToOne
    @JoinColumn(name = "account_id")
    Accounts accounts;
    
    @Column(name = "payment_date")
    @Temporal(TemporalType.DATE)
    java.util.Date paymentDate;
    
    @ManyToOne
    @JoinColumn(name = "payment_mode")
    PaymentMode paymentMode;
    
    @Column(name = "payment_ref")
    String paymentRef;
    
    @Column(name = "payment_amt")
    java.math.BigDecimal paymentAmt;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    java.util.Date createdAt;
    
    @Column(name = "is_active")
    boolean isActive;   
    
    @Column(name = "payment_descr")
    String paymentDescription; 

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

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getPaymentRef() {
        return paymentRef;
    }

    public void setPaymentRef(String paymentRef) {
        this.paymentRef = paymentRef;
    }

    public java.math.BigDecimal getPaymentAmt() {
        return paymentAmt;
    }

    public void setPaymentAmt(java.math.BigDecimal paymentAmt) {
        this.paymentAmt = paymentAmt;
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

    public String getPaymentDescription() {
        return paymentDescription;
    }

    public void setPaymentDescription(String paymentDescription) {
        this.paymentDescription = paymentDescription;
    }

    public Accounts getAccounts() {
        return accounts;
    }

    public void setAccounts(Accounts accounts) {
        this.accounts = accounts;
    }
    
    
    
}
