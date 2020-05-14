describe("Subject related tests", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.selectCareer();
    });

    it("Select a single subject", () => {
        cy.contains("CON102").parent().should("have.class", "disabled-row");
        cy.contains("CON101")
            .click()
            .parent()
            .should("have.class", "Mui-selected");
        cy.contains("CON102").parent().should("not.have.class", "disabled-row");
    });

    it("Select multiple subjects at once (select all checkbox)", () => {
        cy.get("input[aria-label='select all subjects']:first").click();

        cy.contains("Cuatrimestre 2")
            .closest(".MuiGrid-root")
            .find("tbody")
            .children("tr")
            .should("not.have.class", "disabled-row");
    });

    it("Deselecting subjects deselects others that depend on it", () => {
        cy.contains("IDI060").click();
        cy.contains("IDI061").click();
        cy.contains("IDI062").click();
        cy.contains("IDI060").click();

        cy.contains("IDI061").parent().should("have.class", "disabled-row");
        cy.contains("IDI062").parent().should("have.class", "disabled-row");
    });
});
