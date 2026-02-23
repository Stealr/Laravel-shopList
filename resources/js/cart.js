import $ from 'jquery';
import ko from 'knockout';

// Делаем jQuery доступным глобально (для совместимости со старым кодом)
window.$ = window.jQuery = $;
window.ko = ko;

function CartModel(cardData) {
    const self = this;

    self.cartAmount = ko.observable(cardData.cartAmount || 0);
    self.cartSum = ko.observable(cardData.cartSum || 0);

    // возможно нужно преобразовывать элементы в модели товара(создать модель товара)
    // пример данных
    // [
    //     {
    //         "productId": "1",
    //         "amount": 59,
    //         "data": {
    //             "id": "1",
    //             "name": "test 2",
    //             "price": "1500.00",
    //             "tags": "[\"testTag\", \"testTag2\"]"
    //         }
    //     },
    // ]
    self.items = ko.observableArray(cardData.items);

    self.submitOrder = function () {
        alert('Заказ оформлен на сумму ' + self.cartSum() + '\n' + 'Товаров в заказе' + self.cartAmount())
    }

    self.addItem = function (productId, productData, callback) {
        const data = {
            product_id: productId,
            quantity: 1
        }

        $.ajax({
            type: "POST",
            url: '/api/cart/add',
            data: data,
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: (response) => {
                if (response.success && response.cart) {
                    self.cartAmount(response.cart.cartAmount);
                    self.cartSum(response.cart.cartSum);

                    const exists = self.items().find(item => String(item.productId) === String(productId));
                    if (!exists) {
                        self.items.push({
                            productId: productId,
                            amount: 1,
                            data: productData
                        });
                    }

                    callback(true);
                }
            },
            error: () => {
                console.error('ошибка добавления в корзину')
            }
        });
    }

    self.updateAmount = function (productId, delta, callback) {
        const data = {
            product_id: productId,
            quantity: delta
        }

        $.ajax({
            type: "POST",
            url: '/api/cart/update',
            data: data,
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: (response) => {
                if (response.success && response.cart) {

                    console.log(response)
                    self.cartAmount(response.cart.cartAmount || 0);
                    self.cartSum(response.cart.cartSum || 0);

                    const item = self.items().find(item => String(item.productId) === String(productId));
                    if (item) {
                        item.amount += delta;
                        if (item.amount <= 0) {
                            self.items.remove(item);
                        } else {
                            self.items.valueHasMutated();
                        }
                    }

                    callback(true);
                }
            },
            error: () => {
                console.error('ошибка изменения количества');
                callback(false);
            }
        })
    }

    self.isInCart = function (productId) {
        return self.items().some(item => String(item.productId) === String(productId));
    };

    self.getAmountProduct = function (productId) {
        const item = self.items().find(item => String(item.productId) === String(productId));
        return item ? item.amount : 0;
    };
}

$(function () {
    if (window.cartData) {
        window.cartViewModel = new CartModel(window.cartData);
        console.log('init cart');
        ko.applyBindings(cartViewModel, $('.header')[0]);
        ko.applyBindings(cartViewModel, $('.formOrder')[0]);
    }
})
