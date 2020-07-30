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

    it("Deselect a single subject", () => {
        cy.contains("CON101").as("CON101");

        cy.get("@CON101").click().parent().should("have.class", "Mui-selected");

        cy.get("@CON101")
            .click()
            .parent()
            .should("not.have.class", "Mui-selected");
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

    it("Selecting a subject that cannot be selected", () => {
        cy.get("tr.disabled-row:first").click();

        cy.get("div[role='dialog']").should("be.visible");
    });

    it("Show right amount of selected credits", () => {
        let sumOfCredits = 0;

        cy.get("input[aria-label='select all subjects']:first").click();

        cy.get("tr")
            .filter(".Mui-selected")
            .find("td:nth-of-type(4)")
            .then((elements) => {
                elements.each((index, el) => {
                    sumOfCredits += Number(el.innerText);
                });

                cy.get(".credits-count").should("contain.text", sumOfCredits);
            });
    });

    it("Show right amount of selected subjects", () => {
        cy.get("input[aria-label='select all subjects']:first").click();
        cy.get("span.subjects-count")
            .invoke("text")
            .then(($text) => {
                cy.get("tr")
                    .filter(".Mui-selected")
                    .should("have.length", Number($text));
            });
    });
});
