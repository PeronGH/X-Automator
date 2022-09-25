// ==UserScript==
// @name         X Automator For XJTLU
// @version      1.1.2
// @description  Automatically log in and fill in for some XJTLU websites
// @author       Peron
// @match        https://sso.xjtlu.edu.cn/login
// @match        https://core.xjtlu.edu.cn/local/login/index.php*
// @match        https://entry.xjtlu.edu.cn/user/*
// @updateURL    https://github.com/PeronGH/X-Automator/raw/main/x_automator.user.js
// @downloadURL  https://github.com/PeronGH/X-Automator/raw/main/x_automator.user.js
// @grant        none
// ==/UserScript==

'use strict';

console.log('Automator Running...');

const hostname = location.hostname;

if (hostname === 'sso.xjtlu.edu.cn') {
  // SSO Auto Login
  ssoAutoLogin();
} else if (hostname === 'core.xjtlu.edu.cn') {
  // LMO Auto Redirect
  location.href = 'https://core.xjtlu.edu.cn/auth/saml2/login.php';
} else if (hostname === 'entry.xjtlu.edu.cn') {
  // Entry Auto Open Passcode
  const appDiv = document.getElementById('app') as HTMLDivElement;

  // Wait for DOM loading
  const waitAppDiv = () => {
    const currentPage = appDiv.firstElementChild as HTMLDivElement;

    if (currentPage) entryAutomate(currentPage);
    else setTimeout(waitAppDiv);
  };
  waitAppDiv();
} else {
  // Unknown Site
  console.error(
    'Automator: Unknown site, you may report the issue to the developer'
  );
}

function entryAutomate(currentPage: HTMLDivElement) {
  const pageName = currentPage.className;
  if (pageName === 'select-role') {
    const roleEleCol = document.getElementsByClassName('selectbox');

    // Found saved role id
    const queriedRoleId = localStorage.getItem('x-role');
    if (queriedRoleId) {
      const roleEle = roleEleCol[+queriedRoleId] as HTMLDivElement;
      roleEle.click();
    }

    // Set event listener
    for (let i = 0; i < roleEleCol.length; ++i) {
      const roleEle = roleEleCol[i] as HTMLDivElement;

      // Save selection
      roleEle.addEventListener('click', () => {
        localStorage.setItem('x-role', i.toString());
      });
    }
  } else if (pageName === 'homepage-main') {
    // Too buggy, removed, may be added later
    // const redDots = currentPage.getElementsByClassName('readpoint');

    location.href = 'https://entry.xjtlu.edu.cn/user/#/PassCode';
  }
}

function ssoAutoLogin() {
  // Clear wrong username and password
  const warningEle = document.getElementById('msg');
  if (warningEle) localStorage.clear();

  // Get elements
  const nameEle = document.getElementById('username_show') as HTMLInputElement;
  const pwdEle = document.getElementById('password_show') as HTMLInputElement;
  const loginBtn = document.getElementsByClassName(
    'ESCloginBtn'
  )[1] as HTMLButtonElement;

  // Auto login
  autoLogin(nameEle, pwdEle, loginBtn);
}

function autoLogin(
  nameEle: HTMLInputElement,
  pwdEle: HTMLInputElement,
  loginBtn: HTMLButtonElement
) {
  // Common Operations
  const setInputValue = (ele: HTMLInputElement, value: string) => {
    ele.value = value;
    ele.textContent = value;
  };

  const saveInputData = () => {
    localStorage.setItem('x-username', nameEle.value);
    localStorage.setItem('x-password', pwdEle.value);
  };

  const autoSaveInputData = (ele: HTMLInputElement) => {
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
