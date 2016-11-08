package com.mtech.springsecurity.configuration;

import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    Logger logger = Logger.getLogger(CustomSuccessHandler.class.getName());
    @Autowired
    @Qualifier("customUserDetailsService")
    UserDetailsService userDetailsService;

    @Autowired
    CustomSuccessHandler customSuccessHandler;

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        logger.warning("loadUserByUsername");
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.headers().frameOptions().sameOrigin().httpStrictTransportSecurity().disable();
        http.authorizeRequests()
                .antMatchers("/home").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/mainmenu").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/user/getuserstatuses.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN')")
                .antMatchers("/user/save.action").access("hasAnyRole('ROLE_ENT_ADMIN','ROLE_MET_ADMIN')")
                .antMatchers("/user/getusers.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/getuser-in-form.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/user/roles.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/user/update-roles").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN')")
                .antMatchers("/postal/code-save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/user/individualroles.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                //only MET_ADMIN can edit 
                .antMatchers("/entity/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ROLE_MET_ADMIN')")
                .antMatchers("/checkuser").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN')")
                .antMatchers("/entity/formview.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/town/code-save.action").access("hasAnyRole('ENT_ADMIN', 'ROLE_MET_ADMIN')")
                .antMatchers("/legal/type-save.action").access("hasAnyRole('ROLE_MET_ADMIN')")
                .antMatchers("/postal/codeview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/town/codeview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/legal/typeview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/site/save.action").access("hasAnyRole('ROLE_MET_ADMIN')")
                .antMatchers("/entity/comboview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/site/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/branch/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/user/getusername.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/account/getaccount-in-form.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/supplier/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/customer/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/suppliers/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/customers/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/save/bank.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/banks/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/currency/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/currencies/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/industry-code/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/industry-code/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/lineofbusiness/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/lineofbusiness/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/save/bank-branch.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/shareholdingtype/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/shareholdingtypes/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/transactiontype/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/transactiontypes/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/positioninentity/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/positioninentity/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/director/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/directors/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/identitytypes/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/identitytype/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/store/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/stores/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/stockitems/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/stockitem/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/paymode/formview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/paymodes/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/paymode/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/purchases/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/purchase/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/purchase/formview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/sale/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/sales/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/sale/formview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/accessibilitytypes/gridview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/accessibilitytype/save.action").access("hasAnyRole('ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/accessibilitytype/formview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/stockitem/formview.action").access("hasAnyRole('ROLE_USER','ROLE_MET_ADMIN','ENT_ADMIN')")
                .antMatchers("/bootstrap-accounts").permitAll()
                .antMatchers("/accounts/viewchartofaccounts").permitAll()
                .antMatchers("/accounttransactions/gridview.action").permitAll()
                .antMatchers("/accounttransactions/getgridview.action").permitAll()
                .antMatchers("/barcode/inventory.action").permitAll()
                .antMatchers("/accounts/scripts").permitAll()
                .and().formLogin().loginPage("/login").successHandler(customSuccessHandler)
                .usernameParameter("username").passwordParameter("password")
                .and().csrf();
    }


    public static void main(String ars[]){
        BCryptPasswordEncoder br = new BCryptPasswordEncoder();
        System.out.println(br.encode("david"));;
    }

}
