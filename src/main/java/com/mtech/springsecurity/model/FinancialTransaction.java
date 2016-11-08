/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "financial_transactions")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
    name="discriminator",
    discriminatorType=DiscriminatorType.STRING
)
@DiscriminatorValue(value="FINANCIAL_TRANSACTION")
public class FinancialTransaction implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "trans_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date transactionDate;
    
    @Column(name = "amount")
    java.math.BigDecimal amount;
    
    @Column(name = "reference_number")
    String referenceNumber;
    
    @Column(name = "transaction_type")
    String transactionType;
    
    @Column(name = "person_withdrawing")
    String personWithdrawing;
    
    
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    Supplier supplier;
    
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    Customer debtor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getPersonWithdrawing() {
        return personWithdrawing;
    }

    public void setPersonWithdrawing(String personWithdrawing) {
        this.personWithdrawing = personWithdrawing;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Customer getDebtor() {
        return debtor;
    }

    public void setDebtor(Customer debtor) {
        this.debtor = debtor;
    }
    
    
}
