import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandling from '../../hoc/WithErrorHandling/WithErrorHandling';

const INGREDIENTS_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3 
}

class Burgerbuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // ingredients: {
            //     salad: 0,
            //     bacon: 0,
            //     cheese: 0,
            //     meat: 0
            // },
            ingredients: null,
            totalPrice: 4,
            purchasable: false,
            purchasing : false,
            loading: false,
            error: false
        };
    }

    componentDidMount () {
        axios.get('https://react-my-burger-9470c.firebaseio.com/ingredients.json').then( response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true});
        });
    }
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(id => {
            return ingredients[id]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientsHandler = (type) => {
        const count = this.state.ingredients[type] + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = count;
        const price = INGREDIENTS_PRICES[type] + this.state.totalPrice;
        this.setState({totalPrice: price, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientsHandler = (type) => {
        if(this.state.ingredients[type] > 0){
            const count =  this.state.ingredients[type] - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            };
            updatedIngredients[type] = count;
            const price = this.state.totalPrice - INGREDIENTS_PRICES[type];
            this.setState({totalPrice: price, ingredients: updatedIngredients});
            this.updatePurchaseState(updatedIngredients);
        }
    }

    purchaseHandler = () =>{
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        // alert('You Continue');

        this.setState({ loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Smrati Pandey',
                address: {
                    street: 'Teststreet1',
                    zipcode: '41351',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json',order).then(response =>{
            this.setState({ loading: false, purchasing: false });
        }).catch(error =>{
            this.setState({ loading: false, purchasing: false });
        });
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSumm = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.state.ingredients) {
            burger = (
                <Auxiliary>
                    <Burger
                        ingredients={this.state.ingredients} />
                    <BuildControls 
                        addIngredients={this.addIngredientsHandler}
                        removeIngredients = {this.removeIngredientsHandler}
                        disabled = {disableInfo}
                        totalPrice = {this.state.totalPrice}
                        purchasable = {this.state.purchasable}
                        ordered={this.purchaseHandler}/>
                </Auxiliary>
            );
            orderSumm = (
                <OrderSummary 
                    ingredients = {this.state.ingredients}
                    purchaseCancelled = {this.purchaseCancelHandler}
                    purchaseContinued = {this.purchaseContinueHandler}
                    price = {this.state.totalPrice}
                    />
            );
        }

        if(this.state.loading){
            orderSumm = <Spinner />;
        }

        return (
            <Auxiliary>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                {orderSumm}  
                </Modal>
                {burger}  
            </Auxiliary>
        );
    }
}

export default withErrorHandling(Burgerbuilder, axios);