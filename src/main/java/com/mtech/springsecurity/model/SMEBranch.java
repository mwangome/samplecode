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
@Table(name = "sme_branch")
public class SMEBranch implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "branch_name")
    String branchName;
    
    @Column(name = "branch_code")
    String branchCode;
    
    @Column(name = "town_code")
    String townCode;
    
    @Column(name = "post_code")
    String postCode;
    
    @Column(name = "postal_number")
    String postalNumber;
    
    @Column(name = "street_name")
    String streetName;
    
    @Column(name = "floor_size")
    String floorSize;
    
    @Column(name = "store_number")
    String storeNumber;
    
    @Column(name = "building_lr_number")
    String buildingLrNumber;
    
    @Column(name = "accessType")
    String accessType;
    
    @Column(name = "structure_type")
    String structureType;
    
    @ManyToOne
    @JoinColumn(name = "lease_type")
    LeaseType leaseType;
    
    @Column(name = "email_address")
    String emailAddress;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.DATE)
    java.util.Date createdAt;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")      
    SMEEntity entity;

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

    public String getTownCode() {
        return townCode;
    }

    public void setTownCode(String townCode) {
        this.townCode = townCode;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getPostalNumber() {
        return postalNumber;
    }

    public void setPostalNumber(String postalNumber) {
        this.postalNumber = postalNumber;
    }

    public String getStreetName() {
        return streetName;
    }

    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    public String getFloorSize() {
        return floorSize;
    }

    public void setFloorSize(String floorSize) {
        this.floorSize = floorSize;
    }

    public String getStoreNumber() {
        return storeNumber;
    }

    public void setStoreNumber(String storeNumber) {
        this.storeNumber = storeNumber;
    }

    public String getBuildingLrNumber() {
        return buildingLrNumber;
    }

    public void setBuildingLrNumber(String buildingLrNumber) {
        this.buildingLrNumber = buildingLrNumber;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public String getStructureType() {
        return structureType;
    }

    public void setStructureType(String structureType) {
        this.structureType = structureType;
    }

    public LeaseType getLeaseType() {
        return leaseType;
    }

    public void setLeaseType(LeaseType leaseType) {
        this.leaseType = leaseType;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public SMEEntity getEntity() {
        return entity;
    }

    public void setEntity(SMEEntity entity) {
        this.entity = entity;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }
    
    
            
}
