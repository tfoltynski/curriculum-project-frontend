/* eslint-disable no-undef */
/// <reference types="cypress" />

import { ShowProductsResponse } from "../model/showProductsResponse";

describe("Biding suite", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("h2", "Login");
  });

  it("Get bids", () => {
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

      const firstBid = firstProduct.bids[0];
      cy.get("table tr:first-of-type > td:nth-of-type(1)").should(
        "have.text",
        firstBid.amount
      );
      cy.get("table tr:first-of-type > td:nth-of-type(2)").should(
        "have.text",
        firstBid.buyerInformation.firstName
      );
      cy.get("table tr:first-of-type > td:nth-of-type(3)").should(
        "have.text",
        firstBid.buyerInformation.email
      );
      cy.get("table tr:first-of-type > td:nth-of-type(4)").should(
        "have.text",
        firstBid.buyerInformation.phone
      );
    });
  });

  it("Update bid", () => {
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

      const firstBid = firstProduct.bids.find(
        (x) => x.buyerInformation.email == "first@email.com"
      );
      cy.contains(firstBid.buyerInformation.email).click();

      const bidAmount = 600;
      cy.get("#amountId").type(bidAmount.toString());

      cy.intercept(
        {
          method: "POST",
          path: `**/update-bid/${productId}/${firstBid.buyerInformation.email}/${bidAmount}`,
        },
        (req) => {
          req.reply({
            statusCode: 200,
            headers: { "access-control-allow-origin": "*" },
            delay: 50,
          });
        }
      ).as("updateBid");

      cy.contains("Update bid").click();

      cy.wait("@updateBid");

      cy.contains(firstBid.buyerInformation.email)
        .parents("tr")
        .find("td:first-of-type")
        .should("have.text", bidAmount);
    });
  });

  it("Update bid of other user", () => {
    cy.fixture("products.json").then((data: ShowProductsResponse) => {
      const firstProduct = data.products.results[0];
      cy.intercept("GET", "/auctionview/api/v1/seller/show-products", data);

      cy.get("#login-buttons > button:nth-of-type(3)").click();

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

      const firstBid = firstProduct.bids.find(
        (x) => x.buyerInformation.email == "first@email.com"
      );
      cy.contains(firstBid.buyerInformation.email).click();

      const bidAmount = 754378;
      cy.get("#amountId").type(bidAmount.toString());

      cy.contains("Update bid").click();

      cy.contains("Cannot update other user bid");
      cy.contains(firstBid.buyerInformation.email)
        .parents("tr")
        .find("td:first-of-type")
        .should("have.text", firstBid.amount);
    });
  });

  it("Place bid", () => {
    cy.fixture("products.json").then((data: ShowProductsResponse) => {
      const firstProduct = data.products.results[0];
      cy.intercept("GET", "/auctionview/api/v1/seller/show-products", data);

      cy.get("#login-buttons > button:nth-of-type(3)").click();

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

      const bidAmount = 743;
      cy.get("#amountId").type(bidAmount.toString());

      cy.intercept(
        {
          method: "POST",
          path: `**/place-bid`,
        },
        {
          statusCode: 200,
          headers: { "access-control-allow-origin": "*" },
          delay: 50,
        }
      ).as("placeBid");

      cy.contains("Place bid").click();

      cy.wait("@placeBid");

      cy.contains("third@email.com")
        .parents("tr")
        .find("td:first-of-type")
        .should("have.text", bidAmount);
    });
  });
});
