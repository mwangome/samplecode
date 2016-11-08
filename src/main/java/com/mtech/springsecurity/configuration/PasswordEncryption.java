/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.configuration;

import org.jasypt.util.password.BasicPasswordEncryptor;
import org.jasypt.util.text.BasicTextEncryptor;

/**
 *
 * @author derek
 */
public class PasswordEncryption {

    public static String encrypt(String encryptedInput) {
        BasicPasswordEncryptor passwordEncryptor = new BasicPasswordEncryptor();
        return passwordEncryptor.encryptPassword(encryptedInput);
    }

    public static void main(String[] args) {
        
        String myEncryptionPassword = "derek";
        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword(myEncryptionPassword);
        String encrypt = textEncryptor.encrypt(myEncryptionPassword);
        System.out.println("Encrypted::" + encrypt + "::Decrypted::" + textEncryptor.decrypt(encrypt));
    }
}
