/// <reference types="Cypress" />
describe('Firebase app functionalities', () => {

    beforeEach(() => {
        cy.intercept('GET', '**/products.json').as('get')
    })

    before(() => {
        cy.fixture('test_data').then((data) => {
            self.data=data;
        })
    })

    it('test case to Open website', () => {

        cy.visit(Cypress.env('url'));
        cy.wait('@get').its('response.statusCode').should('eq', 200)
    })

    //Functionality to check all sizes
    const Allsizes = ['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL']
    const sizeSort = (size) => {
        cy.get('.filters > .filters-available-size').find(`[value='${size}']`, { timeout: 10000 })
            .next().click()
        cy.wait('@get').its('response.statusCode').should('eq', 200)
        
        
        cy.get('.products-found').find('span').then(($noOfPrducts) => {
            if($noOfPrducts.is(":contains('0 Product(s) found.')"))
            {   
                cy.log('No items found on selected Size')
            }
            else
            {
                cy.log('Items found on selected Size')
            }
        })
    }

    Allsizes.forEach(size => {
        it(`Functionality to filter by size ${size}`, () => {
            sizeSort(size)
        })
    });
    
    
    //Selecting Products order
    it('Functionality to select order by of products', () => {
        cy.get('select').select(self.data.orderby).should('be.visible');
        cy.wait('@get').its('response.statusCode').should('eq',200)
    })


    it('Functionality to select products which has Free Shipping label', () => {
        //let lenthOfProd = 0;
        cy.get('.shelf-item').then(($products) => {
            cy.log($products.length)
            // lenthOfProd = $products.length

            //let randomVal = Math.floor(Math.random() * lenthOfProd)
            cy.get($products).find('.shelf-stopper').each(($el) => {
                cy.get($el).click()  //adding to cart
                cy.get('.float-cart__close-btn').click()//closing cart window
            })
        ////////////////////////////////////////////////////           
        //count on opened Cart
       /* let prodCount =  $products.length// free shipping count on main page
        let cartLength = cy.get('.bag--float-cart-closed > .bag__quantity')
            //let cartCount = cartLength.length
            //expect(prodCount).to.equal(cartLength)
       
         */
        })
    }) 
    
    it('Functionality to increase quantity of products',()=>{
        cy.get('.bag--float-cart-closed').click()
        cy.get('.float-cart__content > .float-cart__shelf-container').find('.shelf-item').each(($el) =>{
            cy.get($el).find('.shelf-item__price').contains('+').click()
        })
    })

    it('Functionality to decrease quantity of products',()=>{
        
        cy.get('.float-cart__content > .float-cart__shelf-container').find('.shelf-item').each(($el) =>{
            cy.get($el).find('.shelf-item__price').contains('-').click()
        })
    })

    it('Functionality to remove product from cart', () =>{
        cy.get('.float-cart__shelf-container > .shelf-item > .shelf-item__del').should('be.visible').eq(0).click()
    })

    it('Functionality to sum all the products which are in cart and compare with SubTotoal', () => {
        let sum = 0;
        let subTotal = 0;
        cy.get('.shelf-item > .shelf-item__price > p').each(($el) => {
            const amount = $el.text()
            cy.log(amount)
            let amountNumber = amount.split(" ")
            cy.log(amountNumber)
            amountNumber = amountNumber[2].trim()
            cy.log(amountNumber)
            sum = Number(sum) + Number(amountNumber)
        }).then(() => {
            cy.log(sum)
        })
        cy.get('.float-cart__footer > .sub-price > p').then(($totalAmount) => {
            const ttl = $totalAmount.text()
            cy.log(ttl)
            let total = ttl.split(" ")
            cy.log(total)
            total = total[1].trim()
            cy.log(total)
            subTotal = Number(total)

        }).then(() => {
            cy.log(subTotal)
            expect(sum).to.equal(subTotal)
        })
    })
})