/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Currency;

/**
 *
 * @author derek
 */
public interface CurrencyDao {
    Currency saveCurrency(Currency currency);
    
    java.util.List<Currency> getCurrencyList();
}
