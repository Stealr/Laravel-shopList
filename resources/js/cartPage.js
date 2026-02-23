import $ from 'jquery';
import ko from 'knockout';

// Делаем jQuery доступным глобально (для совместимости со старым кодом)
window.$ = window.jQuery = $;
window.ko = ko;

function CartPageViewModel() {
    const self = this;

    // Данные корзины
    // {
    //     "items": [
    //         {
    //             "productId": "1",
    //             "amount": 2,
    //             "data": {
    //                 "id": "1",
    //                 "name": "test 2",
    //                 "price": "1500.00",
    //                 "tags": ["testTag", "testTag2"]
    //             }
    //         }
    //     ],
    //     "cartSum": 3000,
    //     "cartAmount": 2
    // }

    self.cartAmount = ko.observable(0);
    self.cartSum = ko.observable(0);
    self.items = ko.observableArray([]);
    self.cartModel = window.cartViewModel;

    self.init = function (cartPageData) {
        self.cartAmount(cartPageData.cartAmount || 0);
        self.cartSum(cartPageData.cartSum || 0);

        const productModels = cartPageData.items.map(item => {
            const product = new Product(
                item.data,
                true,
                item.amount
            );
            return product;
        });

        self.items(productModels);
    };

    self.increaseQuantity = function (product) {
        $.ajax({
            url: '/api/cart/update',
            method: 'POST',
            data: {
                product_id: product.id,
                quantity: 1
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success && response.cart) {
                    product.amount(product.amount() + 1);
                    self.cartAmount(response.cart.cartAmount);
                    self.cartSum(response.cart.cartSum);
                }
            },
            error: function (xhr) {
                console.error('Ошибка увеличения количества:', xhr);
            }
        });
    };

    self.decreaseQuantity = function (product) {
        $.ajax({
            url: '/api/cart/update',
            method: 'POST',
            data: {
                product_id: product.id,
                quantity: -1
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success && response.cart) {
                    const newAmount = product.amount() - 1;
                    product.amount(newAmount);
                    self.cartAmount(response.cart.cartAmount);
                    self.cartSum(response.cart.cartSum);

                    if (newAmount <= 0) {
                        product.inCart(false);
                        self.items.remove(product);
                    }
                }
            },
            error: function (xhr) {
                console.error('Ошибка уменьшения количества:', xhr);
            }
        });
    };

    self.submitOrder = function () {
        if (self.items().length === 0) {
            alert('Корзина пуста!');
            return;
        }
        alert('Заказ оформлен на сумму ' + self.cartSum() + '₽\nТоваров в заказе: ' + self.cartAmount());
    };

    self.clearCart = function () {
        if (!confirm('Вы уверены, что хотите очистить корзину?')) {
            return;
        }

        $.ajax({
            url: '/api/cart/clear',
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.success) {
                    self.items([]);
                    self.cartAmount(0);
                    self.cartSum(0);

                    // Обновляем глобальную модель корзины
                    if (self.cartModel) {
                        self.cartModel.cartAmount(0);
                        self.cartModel.cartSum(0);
                    }
                }
            },
            error: function (xhr) {
                console.error('Ошибка очистки корзины:', xhr);
                alert('Ошибка при очистке корзины');
            }
        });
    };
}

// Модель товара (повторяем из catalog.js для использования)
function Product(data, isInCart, amount) {
    const self = this;

    self.id = data.id;
    self.name = data.name;
    self.price = data.price;
    self.img = data.img;
    self.tags = data.tags || [];
    self.amount = ko.observable(amount);
    self.inCart = ko.observable(isInCart);
}

let cartPageViewModel;
$(function () {
    if (window.cartPageData) {
        cartPageViewModel = new CartPageViewModel();
        cartPageViewModel.init(window.cartPageData);

        ko.applyBindings(cartPageViewModel, $('main')[0]);
    }
});

