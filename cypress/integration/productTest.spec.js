/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Product related suite', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('h2', 'Login');

    cy.get('#login-buttons > button:first-of-type').click();
  });

  it('Add product', () => {
    cy.get('#productNameId').type('Product');
    cy.get('#shortDescriptionId').type('Short descr');
    cy.get('#detailedDescriptionId').type('Very descriptive description');
    cy.get('#categoryId').should('have.value', 'Painting');
    cy.get('#categoryId').select('Sculptor');
    cy.get('#startingPriceId').type(15);
    cy.get('#bidEndDateId').type('2022-05-31T18:00:00');

    cy.intercept(
      {
        method: 'POST',
        path: '**/add-product',
      },
      (req) => {
        req.reply({
          statusCode: 200,
          body: '649387f478ade47f',
          headers: { 'access-control-allow-origin': '*' },
          delay: 200,
        });
      }
    ).as('addProduct');

    cy.contains('Create product').click();

    cy.wait('@addProduct');
    cy.get('@addProduct');
  });
});
