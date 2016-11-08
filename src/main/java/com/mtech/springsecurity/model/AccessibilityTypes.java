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
import javax.persistence.Table;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "accessibility_types")
public class AccessibilityTypes implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "access_code")
    String accessibilityCode;
    
    @Column(name = "access_name")
    String accessibilityName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccessibilityCode() {
        return accessibilityCode;
    }

    public void setAccessibilityCode(String accessibilityCode) {
        this.accessibilityCode = accessibilityCode;
    }

    public String getAccessibilityName() {
        return accessibilityName;
    }

    public void setAccessibilityName(String accessibilityName) {
        this.accessibilityName = accessibilityName;
    }

    
    
}
