/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Login related suite', () => {
  it('Login works', () => {
    cy.visit('/');
    cy.contains('Login');

    cy.get('#login-buttons > button:first-of-type')
      .invoke('text')
      .then((loginButtonText) => {
        const userFullName = loginButtonText.split('(')[0].trimEnd();
        cy.get('#login-buttons > button:first-of-type').click();
        cy.contains('h2', 'Product');
        cy.contains(userFullName);
      });
  });

  it('Logout works', () => {
    cy.visit('/');
    cy.contains('h2', 'Login');

    cy.get('#login-buttons > button:first-of-type')
      .invoke('text')
      .then((loginButtonText) => {
        const userFullName = loginButtonText.split('(')[0].trimEnd();
        cy.get('#login-buttons > button:first-of-type').click();
        cy.contains(userFullName).click();
        cy.contains('h2', 'Login');
      });
  });
});
