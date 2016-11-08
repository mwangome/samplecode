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
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "sme_directors")
public class Director implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "director_name")
    private String directorName;
    
    @OneToOne
    @JoinColumn(name = "position_in_entity")
    PositionInEntity positionInEntity;
    
    @OneToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @Column(name = "shareholding")
    String shareholding;
    
    @Column(name = "identity_number")
    String identityNumber;
    
    @Column(name = "residence_town")
    String residenceTown;
    
    @Column(name = "residence_lease")
    String residenceLease;
    
    @Column(name = "phone_number")
    String phoneNumber;
    
    @OneToOne
    @JoinColumn(name = "identity_type")
    IdentityType identityType;
    
    @OneToOne
    @JoinColumn(name = "shareholding_type")
    ShareholdingType shareholdingType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDirectorName() {
        return directorName;
    }

    public void setDirectorName(String directorName) {
        this.directorName = directorName;
    }

    public PositionInEntity getPositionInEntity() {
        return positionInEntity;
    }

    public void setPositionInEntity(PositionInEntity positionInEntity) {
        this.positionInEntity = positionInEntity;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }

    public String getShareholding() {
        return shareholding;
    }

    public void setShareholding(String shareholding) {
        this.shareholding = shareholding;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getResidenceTown() {
        return residenceTown;
    }

    public void setResidenceTown(String residenceTown) {
        this.residenceTown = residenceTown;
    }

    public String getResidenceLease() {
        return residenceLease;
    }

    public void setResidenceLease(String residenceLease) {
        this.residenceLease = residenceLease;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public IdentityType getIdentityType() {
        return identityType;
    }

    public void setIdentityType(IdentityType identityType) {
        this.identityType = identityType;
    }

    public ShareholdingType getShareholdingType() {
        return shareholdingType;
    }

    public void setShareholdingType(ShareholdingType shareholdingType) {
        this.shareholdingType = shareholdingType;
    }  
    
    
}
