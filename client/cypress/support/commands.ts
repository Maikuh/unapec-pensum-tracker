declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select a career from the dropdown
         * @example cy.selectCareer() // defaults to "negocios"
         * @example cy.selectCareer("iso")
         */
        selectCareer(textToType?: string): Chainable<Element>;
    }
}

Cypress.Commands.add("selectCareer", (textToType: string = "negocios") => {
    cy.get("#carreer-search-box").type(`${textToType}{enter}`);
    cy.contains("Informacion").should("be.visible");
});
