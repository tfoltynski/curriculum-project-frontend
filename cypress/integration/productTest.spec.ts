/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
/// <reference types="cypress" />

import { CreateProductCommand } from "../model/createProductCommand";
import { ShowProductsResponse } from "../model/showProductsResponse";

describe("Product suite", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("h2", "Login");
  });

  it("Add product", () => {
    cy.get("#login-buttons > button:first-of-type").click();

    const date = new Date();
    date.setDate(date.getDate() + 1);
    cy.get("#productNameId").type("Product");
    cy.get("#shortDescriptionId").type("Short descr");
    cy.get("#detailedDescriptionId").type("Very descriptive description");
    cy.get("#categoryId").should("have.value", "Painting");
    cy.get("#categoryId").select("Sculptor");
    cy.get("#startingPriceId").type("15");
    cy.get("#bidEndDateId").type(date.toISOString());

    cy.intercept({
      method: "POST",
      path: "**/add-product",
    }).as("addProduct");

    cy.contains("Create product").click();

    cy.wait("@addProduct");
    cy.get("@addProduct").then(req => {
      const xhr = req as unknown as XMLHttpRequest;
      const productId = xhr.response.body;
      cy.get("#selectProduct").should("have.value", productId);
      cy.request("POST", `/auction/api/v1/seller/delete/${productId}`);
    })
  });

  it("Add product too short product name", () => {
    cy.get("#login-buttons > button:first-of-type").click();

    const date = new Date();
    date.setDate(date.getDate() + 1);
    cy.get("#productNameId").type("Pro");
    cy.get("#shortDescriptionId").type("Short descr");
    cy.get("#detailedDescriptionId").type("Very descriptive description");
    cy.get("#categoryId").should("have.value", "Painting");
    cy.get("#categoryId").select("Sculptor");
    cy.get("#startingPriceId").type("15");
    cy.get("#bidEndDateId").type(date.toISOString());

    cy.intercept({
      method: "POST",
      path: "**/add-product",
    }).as("addProduct");

    cy.contains("Create product").click();

    cy.wait("@addProduct");
    cy.get("@addProduct").then(req => {
      const xhr = req as unknown as XMLHttpRequest;
      const error = xhr.response.body.title;
      expect(error).to.contain("Product Name")
    })
  });

  it("Delete product", () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const createProductJson: CreateProductCommand = {
      bidEndDate: date.toISOString(),
      categoryType: "Sculptor",
      detailedDescription: "Very detailed description",
      productName: "Product",
      shortDescription: "Short descr",
      startingPrice: 15,
      sellerInformation: {
        address: "Address",
        city: "San Francisco",
        email: "first@email.com",
        firstName: "Johnny",
        lastName: "Devito",
        phone: "1111111111",
        pin: "Pin",
        state: "State",
      },
    };
    cy.request("POST", `/auction/api/v1/seller/add-product`, createProductJson)
      .its("body")
      .then((body) => {
        const productId = body;
        cy.wait(100);
        cy.get("#login-buttons > button:first-of-type").click();

        cy.intercept({
          method: "GET",
          path: `**/show-product/${productId}`,
        }).as("showProduct");

        cy.get("#selectProduct").select(productId);
        cy.get("#selectProduct").should("have.value", productId);

        cy.wait("@showProduct");

        cy.intercept({
          method: "POST",
          path: `**/delete/${productId}`,
        }).as("deleteProduct");

        cy.contains("Delete product").click();

        cy.wait("@deleteProduct");
        cy.get("#selectProduct").should("have.value", "Select product...");
      });
  });

  it("Delete not existing product", () => {
    cy.fixture("products.json").then((data: ShowProductsResponse) => {
      const firstProduct = data.products.results[0];
      cy.intercept("GET", "/auctionview/api/v1/seller/show-products", data);

      cy.get("#login-buttons > button:first-of-type").click();

      const productId = "627ff3aa0c7362bf8e7f6df5";
      cy.intercept(
        "GET",
        `/auctionview/api/v1/seller/show-product/${productId}`,
        firstProduct
      ).as("getProduct");
      cy.get("#selectProduct").select(productId);
      cy.get("#selectProduct").should("have.value", productId);

      cy.wait("@getProduct");

      cy.intercept({
        method: "POST",
        path: `**/delete/${productId}`,
      }).as("deleteProduct");

      cy.contains("Delete product").click();

      cy.wait("@deleteProduct");
      cy.get("@deleteProduct").then(req => {
        const xhr = req as unknown as XMLHttpRequest;
        const error = xhr.response.body.title;
        expect(error).to.contain("could not be found");
      })
    });
  });

  it("Select product", () => {
    cy.fixture("products.json").then((data: ShowProductsResponse) => {
      const firstProduct = data.products.results[0];
      cy.intercept("GET", "/auctionview/api/v1/seller/show-products", data);

      cy.get("#login-buttons > button:first-of-type").click();

      const productId = "627ff3aa0c7362bf8e7f6df5";
      cy.intercept(
        "GET",
        `/auctionview/api/v1/seller/show-product/${productId}`,
        firstProduct
      ).as("getProduct");
      cy.get("#selectProduct").select(productId);
      cy.get("#selectProduct").should("have.value", productId);

      cy.wait("@getProduct");

      cy.get("#productNameId").should("have.value", firstProduct.productName);
      cy.get("#shortDescriptionId").should(
        "have.value",
        firstProduct.shortDescription
      );
      cy.get("#detailedDescriptionId").should(
        "have.value",
        firstProduct.detailedDescription
      );
      cy.get("#categoryId").should("have.value", firstProduct.categoryType);
      cy.get("#startingPriceId").should(
        "have.value",
        firstProduct.startingPrice
      );
      cy.get("#bidEndDateId").should("have.value", firstProduct.bidEndDate);
    });
  });
});
