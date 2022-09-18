// ==UserScript==
// @name         X Automator For XJTLU
// @version      1.0.0
// @description  Automatically log in and fill in for some XJTLU websites
// @author       Peron
// @match        https://sso.xjtlu.edu.cn/login
// @match        https://core.xjtlu.edu.cn/local/login/index.php*
// @grant        none
// ==/UserScript==
'use strict';
console.log('Automator Running...');
switch (location.hostname) {
    case 'sso.xjtlu.edu.cn':
        ssoAutoLogin();
        break;
    case 'core.xjtlu.edu.cn':
        // LMO Auto Redirect
        location.href = 'https://core.xjtlu.edu.cn/auth/saml2/login.php';
        break;
    default:
        console.error('Automator: Unknown site, you may report the issue to the developer');
}
function ssoAutoLogin() {
    // Clear wrong username and password
    const warningEle = document.getElementById('msg');
    if (warningEle)
        localStorage.clear();
    // Get elements
    const nameEle = document.getElementById('username_show');
    const pwdEle = document.getElementById('password_show');
    const loginBtn = document.getElementsByClassName('ESCloginBtn')[1];
    // Auto login
    autoLogin(nameEle, pwdEle, loginBtn);
}
function autoLogin(nameEle, pwdEle, loginBtn) {
    // Basic Operations
    const setInputValue = (ele, value) => {
        ele.value = value;
        ele.textContent = value;
    };
    const saveInputData = () => {
        localStorage.setItem('x-username', nameEle.value);
        localStorage.setItem('x-password', pwdEle.value);
    };
    const autoSaveInputData = (ele) => {
        ele.addEventListener('keydown', saveInputData);
        ele.addEventListener('input', saveInputData);
    };
    // Change element default behavior
    autoSaveInputData(nameEle);
    autoSaveInputData(pwdEle);
    // if password already exists
    const queriedName = localStorage.getItem('x-username');
    const queriedPwd = localStorage.getItem('x-password');
    if (queriedName && queriedPwd) {
        setInputValue(nameEle, queriedName);
        setInputValue(pwdEle, queriedPwd);
        loginBtn.click();
    }
}