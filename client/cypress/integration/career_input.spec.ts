describe("Career select input related tests", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Input is in focus", () => {
        cy.get("#carreer-search-box").should("have.focus");
    });

    it("User can select a career", () => {
        cy.selectCareer();
    });

    it("User can clear input", () => {
        cy.selectCareer();

        cy.get("button[aria-label='Clear']").click();
        cy.get("h1.main-title").should("be.visible");
    });
});
