<div class="shop-card">
    <div class="shop-card__back">
        {{-- Knockout сам подставит src --}}
        <img data-bind="attr: { src: img, alt: name }"/>
    </div>
    <div class="shop-card__info">
        <div class="shop-card__top">
            <div class="shop-card__flex-between">
                <p class="shop-card__price">
                    <span data-bind="text: price"></span>р
                </p>
                <div>
                    {{-- id товара для Knockout берется из модели JS, а не из PHP --}}
                    <button data-bind="click: $root.addItem, visible: !inCart(), attr: {'data-product-id': id}"
                            id="btn-add-cart" class="shop-card__btn-amount">+</button>

                    <div data-bind="visible: inCart()" class="shop-card__amount-control" style="display: none;">
                        <button class="shop-card__btn-amount" data-bind="click: $root.decreaseQuantity">-</button>
                        <span data-bind="text: amount"></span>
                        <button class="shop-card__btn-amount" data-bind="click: $root.increaseQuantity">+</button>
                    </div>
                </div>
            </div>
            <p data-bind="text: name" class="shop-card__name"></p>
        </div>
        <div class="shop-card__bottom">
            {{-- Теги уже прилетают готовым массивом благодаря $casts в модели --}}
            <div data-bind="foreach: tags" class="shop-card__tags">
                <span data-bind="text: $data" class="tag"></span>
            </div>
        </div>
    </div>
</div>
