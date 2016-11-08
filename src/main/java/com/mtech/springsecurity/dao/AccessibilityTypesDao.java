/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccessibilityTypes;

/**
 *
 * @author derek
 */
public interface AccessibilityTypesDao {
    
    AccessibilityTypes saveAccessibilityType(AccessibilityTypes accessibilityType);
    
    java.util.List<AccessibilityTypes> getAccessibilityTypesList();
    
    AccessibilityTypes findAccessibilityType(Long id);
}
