describe("Career select input related tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Career search trigger is visible on home page", () => {
    cy.get("[data-testid='career-search-trigger']").should("be.visible");
  });

  it("User can select a career and navigate to its page", () => {
    cy.selectCareerFromHome("negocios");
    cy.url().should("include", "/pensums/NIN11");
  });

  it("User can navigate back to home from a pensum page", () => {
    cy.selectCareer();
    cy.get("a[href='/']").first().click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get("[data-testid='career-search-trigger']").should("be.visible");
  });
});
