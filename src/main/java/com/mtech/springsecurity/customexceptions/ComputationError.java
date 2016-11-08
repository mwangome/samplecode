/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.customexceptions;

/**
 *
 * @author derek
 */
public class ComputationError extends Exception{
    public ComputationError(String message){
        super("Error in calculation::" + message);
    }
}
