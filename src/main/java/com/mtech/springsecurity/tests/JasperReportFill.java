/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.tests;

/**
 *
 * @author derek
 */
public class JasperReportFill {
    static int NO_MONTHS = 12;
    public static void main(String[] args) {
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
        java.util.Date startOfPeriod;
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        java.util.Calendar calendar2 = java.util.Calendar.getInstance();
        calendar.set(2016, 6, 1);
        startOfPeriod = calendar.getTime();
        System.out.println(sdf.format(startOfPeriod));

        java.util.Date endOfPeriod;
        calendar.set(
                calendar.get(java.util.Calendar.YEAR) + 1,
                calendar.get(java.util.Calendar.MONTH) - 1,
                calendar.get(java.util.Calendar.DAY_OF_MONTH)
        );
        calendar.set(java.util.Calendar.DAY_OF_MONTH, calendar.getActualMaximum(java.util.Calendar.DAY_OF_MONTH));
        endOfPeriod = calendar.getTime();    

        System.out.println(sdf.format(endOfPeriod));
        System.out.println("---");
        
        for(int i = 0; i < NO_MONTHS; i++){
            calendar.setTime(startOfPeriod);
            calendar.set(
                    calendar.get(java.util.Calendar.YEAR), 
                    calendar.get(java.util.Calendar.MONTH) + i, 
                    calendar.get(java.util.Calendar.DAY_OF_MONTH));
            calendar2.setTime(calendar.getTime());
            calendar2.set(java.util.Calendar.DAY_OF_MONTH, calendar2.getActualMaximum(java.util.Calendar.DAY_OF_MONTH));
            System.out.println(sdf.format(calendar.getTime()) + " ---> " + sdf.format(calendar2.getTime()));
        }
    }
}
