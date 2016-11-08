/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "financial_transactions")
@DiscriminatorValue("Bank")
public class BankTransaction  extends FinancialTransaction{
//    @Column(name = "transaction_type")
//    String transactionType;
    
    @Column(name = "bank_branch")
    String bankBranch;
    
    /**
     * Withdrawal
     */
//    @Column(name = "person_withdrawing")
//    String personWithdrawing;
    
    @Column(name = "cheque_no")
    String chequeNumber;
    
    /**
     * Deposit
     */
    @Column(name = "drawer")
    String drawer;

//    public String getTransactionType() {
//        return transactionType;
//    }
//
//    public void setTransactionType(String transactionType) {
//        this.transactionType = transactionType;
//    }

    public String getBankBranch() {
        return bankBranch;
    }

    public void setBankBranch(String bankBranch) {
        this.bankBranch = bankBranch;
    }

//    public String getPersonWithdrawing() {
//        return personWithdrawing;
//    }
//
//    public void setPersonWithdrawing(String personWithdrawing) {
//        this.personWithdrawing = personWithdrawing;
//    }

    public String getChequeNumber() {
        return chequeNumber;
    }

    public void setChequeNumber(String chequeNo) {
        this.chequeNumber = chequeNo;
    }

    public String getDrawer() {
        return drawer;
    }

    public void setDrawer(String drawer) {
        this.drawer = drawer;
    }
    
    
}
