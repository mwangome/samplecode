package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.ModuleDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.enumerate.Modules;
import com.mtech.springsecurity.model.LegalType;
import com.mtech.springsecurity.model.PostalCode;
import com.mtech.springsecurity.model.TownCode;
import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.model.UserProfile;
import com.mtech.springsecurity.enumerate.UserProfileType;
import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.Module;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.model.SMEBranch;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.AccountingPeriodService;
import com.mtech.springsecurity.service.AppService;
import com.mtech.springsecurity.service.EnumService;
import com.mtech.springsecurity.service.LegalTypeService;
import com.mtech.springsecurity.service.ModuleService;
import com.mtech.springsecurity.service.PostalCodesService;
import com.mtech.springsecurity.service.SMEBranchService;
import com.mtech.springsecurity.service.TownCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.mtech.springsecurity.service.UserService;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.ComputationsRunner;
import com.mtech.springsecurity.util.JavaMail;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Date;
import java.util.Set;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.ModelAttribute;

@PropertySource(value = {"classpath:application.properties"})
@Controller
public class AppController {

    static Logger log = Logger.getLogger(AppController.class.getName());

    @Autowired
    UserService userService;

    @Autowired
    UserDao userDao;

    @Autowired
    AppService appService;

    @Autowired
    EnumService enumService;

    @Autowired
    PostalCodesService postalService;

    @Autowired
    TownCodeService tcService;

    @Autowired
    LegalTypeService ltService;

    @Autowired
    SMEBranchService smeBranchService;

    @Autowired
    SMEEntityDao smeDao;

    @Autowired
    private Environment environment;

    @Autowired
    ModuleDao modDao;

    @Autowired
    ModuleService modServe;

    @Autowired
    AccountingPeriodService apService;

    @Autowired
    AppUtil appUtil;

    @Autowired
    ComputationsRunner cmpRunner;

//    @RequestMapping(value = {"/"}, method = RequestMethod.GET)
//    public String loginPage() {
//        return "index";
//    }
    
    @RequestMapping(value = {"/", "/landing", "/login"}, method = RequestMethod.GET)
    public String landingPage() {
        return "landing-page";
    }

    @RequestMapping(value = {"/home"}, method = RequestMethod.GET)
    public String homePage(ModelMap model) {
        model.addAttribute("user", getPrincipal());
        return "homepage";
    }

    @RequestMapping(value = {"/mainmenu"}, method = RequestMethod.GET)
    public String mainMenuPage(ModelMap model) {
        model.addAttribute("user", getPrincipal());
        return "layout-browser";
    }

    @RequestMapping(value = {"/user/save.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String saveUser(@ModelAttribute User user,
            @RequestParam(value = "role") String code,
            @RequestParam(value = "branchName") String branchName,
            @RequestParam(value = "registeredName") String registeredName,
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "passwordChecker", required = false) String passwordChecker,
            HttpServletRequest request) throws MalformedURLException, URISyntaxException {
        String pr = getPrincipal();

        log.warn("status-date::" + user.getStatusDate());
        URL url = new URL(request.getRequestURL().toString());
        String link = url.getProtocol() + "://" + url.getHost() + ":" + url.getPort() + "" + request.getContextPath();
        java.util.Set<Role> prof = new java.util.HashSet();

        SMEBranch findBranch = smeBranchService.findBranch(branchName);
        SMEEntity findSMEEntity = smeDao.findSMEEntity(registeredName);

        user.setSmeEntity(findSMEEntity);
        user.setBranch(findBranch);

        if (user.getId() == null && !passwordChecker.equalsIgnoreCase(user.getPassword())) {
            return "{\"success\":true, \"msg\":\"Save attempt failed! Do not change the generated password!\"}";
        }
        if (user.getId() == null && passwordChecker.equalsIgnoreCase(user.getPassword())) {
            JavaMail jm = new JavaMail();
            try {
                jm.generateAndSendEmail(user.getEmail(), user.getFirstName(), "Link: " + link + "?username=" + user.getUsername() + " Username: " + user.getUsername() + " Password: " + passwordChecker);
            } catch (MessagingException ex) {
                return "{\"success\":true, \"msg\":\"Mail could not be sent! Please check your internet connection!\"}";
            }
        }

        Role userProfile = userDao.findProfile(UserProfileType.parseType(code));
        if (userProfile == null) {
            userProfile = new Role();
            userProfile.setRoleName(code);
        }
        prof.add(userProfile);
        user.setUserRoles(prof);
        try {
            userDao.saveUser(user);
            return "{\"success\":true, \"msg\":\"User " + user.getFirstName() + " has been saved!\"}";
        } catch (Exception x) {
            return "{\"success\":true, \"msg\":\"Save attempt failed - " + x + "!\"}";
        }

    }

    @RequestMapping(value = {"/user/getuserstatuses.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getUserState() {
        String statuses = enumService.getStatuses();
        return statuses;
    }

    @RequestMapping(value = {"/user/getusers.action"}, method = RequestMethod.GET) //
    @ResponseBody
    public String getUsersList() {
        String statuses = appService.getUsers();
        return statuses;
    }

    @RequestMapping(value = {"/user/roles.action"}, method = RequestMethod.GET) //
    @ResponseBody
    public String getUsersRoles() {
        String statuses = enumService.getRoles();
        return statuses;
    }

    @RequestMapping(value = {"/getuser-in-form.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getUsersListForm(@RequestParam(value = "id") Long id) {
        String statuses = appService.getUser(id);
        return statuses;
    }

    @RequestMapping(value = {"/user/update-roles"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getRoles(@RequestParam(value = "id") Long id,
            @RequestParam(value = "data") String data) {
        JSONObject json = JSONObject.fromObject(data);
        JSONArray array = (JSONArray) json.get("data");
        java.util.Set profiles = new java.util.HashSet();
        for (int i = 0; i < array.size(); i++) {
            String prof = array.get(i).toString();
            UserProfileType type = UserProfileType.parseType(prof);
            UserProfile up = new UserProfile();
            up.setType(type);
            profiles.add(up);
        }
        User user = userDao.findById(id);
        user.setUserRoles(profiles);
        userDao.saveUser(user);
        return "{\"success\":true, \"msg\":\"a message from server!\"}";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/landing?logout";
    }

    @RequestMapping(value = {"/user/individualroles.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getRolesTasks(@RequestParam(value = "role") String code) {
        String pr = getPrincipal();

        UserProfileType userProfileType = UserProfileType.parseType(code);

        String tasks = appService.getRolesTasks(userProfileType);
        return tasks;
    }

    @RequestMapping(value = {"/postal/code-save.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String savePostalCode(@ModelAttribute PostalCode code) {
        getPrincipal();
        postalService.savePostalCodes(code);
        return "{\"success\":true, \"msg\":\"Saved postal code successfully!\"}";
    }

    @RequestMapping(value = {"/town/code-save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveTownCode(@ModelAttribute TownCode code) {
        getPrincipal();
        tcService.saveTownCode(code);
        return "{\"success\":true, \"msg\":\"Saved town code successfully!\"}";
    }

    @RequestMapping(value = {"/legal/type-save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveLegal(@ModelAttribute LegalType type) {
        getPrincipal();
        ltService.saveLegalType(type);
        return "{\"success\":true, \"msg\":\"Saved legal type successfully!\"}";
    }

    @RequestMapping(value = {"/user/getusername.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getUser(HttpServletRequest request) throws MalformedURLException {
        String user = getPrincipal();

        User userObject = userDao.findByUsername(user);
        URL url = new URL(request.getRequestURL().toString());
        String link = url.getProtocol() + "://" + url.getHost() + ":" + url.getPort();

        String jasperserver = environment.getRequiredProperty("jasperserver.url");

        SMEEntity smeEntity = userDao.findByUsername(user).getSmeEntity();

        Module moduleLoan = modDao.findModule(Modules.LOAN_CENTER.getDescription(), smeEntity);
        Set<User> loanModuleUsers = new java.util.HashSet();
        try {
            loanModuleUsers = moduleLoan.getUsers();
        } catch (Exception x) {
            log.warn(x);
        }
        boolean userLoanEnabled = modServe.isUserEnabled(user, loanModuleUsers);

        Module moduleAccounts = modDao.findModule(Modules.ACCOUNTS.getDescription(), smeEntity);
        Set<User> accountsModuleUsers = new java.util.HashSet();
        try {
            accountsModuleUsers = moduleAccounts.getUsers();
        } catch (Exception x) {
            log.warn(x);
        }
        boolean userAccountsEnabled = modServe.isUserEnabled(user, accountsModuleUsers);

        String lDate = "";
        String endDate = "";
        try {
            Date lastClosedDate = apService.getLastClosedDate(smeEntity);
            request.getSession().setAttribute("lastClosedDate", lastClosedDate);
            lDate = appUtil.formatJSDate(lastClosedDate, "yyyy-MM-dd");

        } catch (Exception x) {
            log.warn(x);
        }

        try {
            AccountingPeriod currAp = apService.getCurrentAccountingPeriod(smeEntity);
            endDate = appUtil.formatJSDate(currAp.getEndDate(), "dd/MM/yyyy");
        } catch (Exception x) {
            log.warn("Error when getting current ap date::" + x);
        }

        cmpRunner.setEntity(smeEntity);
        Thread th = new Thread(cmpRunner);
        th.start();

        request.getSession().setAttribute("entity", smeEntity);
        return "{\"success\":true, "
                + "\"name\":\"" + userObject.getFirstName() + "\", "
                + "\"entityId\":\"" + userObject.getSmeEntity().getId() + "\", "
                + "\"entityName\":\"" + smeEntity.getRegisteredName() + "\","
                + "\"base_url\":\"" + link + "\", "
                + "\"endDate\":\"" + endDate + "\", "
                + "\"lastClosedDate\":\"" + lDate + "\", "
                + "\"loanModuleEnabled\":" + (moduleLoan == null ? false : moduleLoan.getEnabled()) + ", "
                + "\"accountsModuleEnabled\":" + (moduleAccounts == null ? false : moduleAccounts.getEnabled()) + ", "
                + "\"userEnabledLoan\":" + userLoanEnabled + ", "
                + "\"userEnabledAccounts\":" + userAccountsEnabled + ", "
                + "\"" + Modules.LOAN_CENTER + "\":\"" + (moduleLoan == null ? "" : moduleLoan.getPath()) + "\", "
                + "\"jasperserver\":\"" + jasperserver + "\"}";
    }

    @RequestMapping(value = {"/user/ispasswordreset.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String isPasswordReset(@RequestParam(value = "username", required = false) String username) throws MalformedURLException {

        User userObject = null;
        boolean isReset = false;
        try {
            userObject = userDao.findByUsername(username);
            isReset = userObject.isPasswordReset();
        } catch (Exception x) {
            log.warn("" + x);
        }
        return "{\"success\":true, \"ispasswordreset\":" + isReset + "}";
    }

    @RequestMapping(value = {"/user/resetpassword.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String resetPassword(@RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "newPassword", required = false) String newPassword) throws MalformedURLException {

        log.warn("username::" + username);
        User userObject = null;
        try {
            userObject = userDao.resetUserPassword(username, password, newPassword);
        } catch (Exception x) {
            log.warn("error resetting password::" + x);
        }
        return "{\"success\":true, \"password\":\"" + newPassword + "\", \"msg\":\"You have successfully updated your password!\"}";
    }

    private String getPrincipal() {
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }
}
