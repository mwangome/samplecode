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
@Table(name = "receipts")
public class Receipt implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "receipt_ref")
    String receiptRef;
    
    @Column(name = "receipt_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date receiptDate;
    
    @Column(name = "receipt_mode")
    String receiptMode;
    
    @ManyToOne
    @JoinColumn(name = "invoice_number")
    Payment payment;
    
    @ManyToOne
    @JoinColumn(name = "Sales_ref_number")
    Sale sale;
    
    @Column(name = "receipt_amt")
    java.math.BigDecimal receiptAmt;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    java.util.Date createdAt;
    
    @Column(name = "is_active")
    boolean isActive;  

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiptRef() {
        return receiptRef;
    }

    public void setReceiptRef(String receiptRef) {
        this.receiptRef = receiptRef;
    }

    public Date getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Date receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getReceiptMode() {
        return receiptMode;
    }

    public void setReceiptMode(String receiptMode) {
        this.receiptMode = receiptMode;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment sale) {
        this.payment = sale;
    }

    public java.math.BigDecimal getReceiptAmt() {
        return receiptAmt;
    }

    public void setReceiptAmt(java.math.BigDecimal receiptAmt) {
        this.receiptAmt = receiptAmt;
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

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    } 

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }   
    
}
