import $ from 'jquery';
import ko from 'knockout';

// Делаем jQuery доступным глобально (для совместимости со старым кодом)
window.$ = window.jQuery = $;
window.ko = ko;

// Настройка CSRF токена для всех AJAX запросов
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// Модель одного товара
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

// ViewModel каталога
function CatalogViewModel() {
    const self = this;

    // Данные
    self.products = ko.observableArray([]);
    self.cartModel = window.cartViewModel; // Ссылка на глобальную модель корзины

    // Пагинация
    self.currentPage = ko.observable(1);
    self.totalPages = ko.observable(1);
    self.pages = ko.observableArray([]); // Массив чисел [1, 2, 3...]

    // Инициализация при загрузке страницы
    self.init = function (data) {
        // Если пришли товары
        if (data.products) {
            self.updateList(data.products);
        }
        // Если пришла информация о пагинации (с сервера)
        if (data.pagination) {
            self.updatePagination(data.pagination);
        }
    }

    // Вспомогательная функция: превращает сырые данные в модели Product
    self.updateList = function(productsData) {
        const productModels = productsData.map(
            product =>
                new Product(
                    product,
                    self.cartModel ? self.cartModel.isInCart(product.id) : false,
                    self.cartModel ? self.cartModel.getAmountProduct(product.id) : 0
                )
        );
        self.products(productModels);
    }

    // Вспомогательная функция: обновляет цифры пагинации
    self.updatePagination = function(paginationData) {
        console.log('updatePagination called with data:', paginationData);
        self.currentPage(Number(paginationData.currentPage));
        self.totalPages(Number(paginationData.totalPages));

        // Генерируем массив страниц: [1, 2, 3 ... Total]
        let pagesArr = [];
        for (let i = 1; i <= self.totalPages(); i++) {
            pagesArr.push(i);
        }
        self.pages(pagesArr);
        console.log('Pages array:', pagesArr);
        console.log('Current page:', self.currentPage(), 'Total pages:', self.totalPages());
    }

    // --- ЛОГИКА AJAX ЗАГРУЗКИ (Фильтр + Пагинация) ---
    self.loadData = function(page) {
        const formElement = $('form'); // Находим форму фильтрации
        const formData = formElement.serializeArray(); // Собираем данные: search, prices

        // Преобразуем formData в объект для GET запроса
        const params = {};
        formData.forEach(item => {
            params[item.name] = item.value;
        });
        params.page = page;

        $.ajax({
            type: "GET",
            url: '/api/catalog/products',
            data: params,
            dataType: "json",
            success: (response) => {
                if (response.success) {
                    // 1. Обновляем товары
                    self.updateList(response.products);
                    // 2. Обновляем пагинацию
                    if (response.pagination) {
                        self.updatePagination(response.pagination);
                    }
                    // 3. Скроллим наверх для удобства
                    $('html, body').animate({ scrollTop: 0 }, 300);
                } else {
                    console.error('Ошибка получения данных');
                }
            },
            error: (err) => {
                console.error('AJAX error:', err);
            }
        });
    }

    // Вызывается при нажатии кнопки "Найти" (через submit формы)
    self.applyFilter = function () {
        self.loadData(1); // При новом поиске всегда идем на 1 страницу
    };

    // Вызывается при клике на кнопки пагинации
    self.goToPage = function(pageNumber) {
        // Проверка границ
        if (pageNumber < 1 || pageNumber > self.totalPages()) {
            return false;
        }
        // Если это та же страница, не делаем запрос (но только для кнопок с номерами)
        if (pageNumber === self.currentPage()) {
            return false;
        }
        self.loadData(pageNumber);
        return false; // Предотвращаем переход по ссылке
    }

    // Отдельные методы для стрелок
    self.goToPrevPage = function() {
        console.log('goToPrevPage called, current page:', self.currentPage());
        const prevPage = self.currentPage() - 1;
        if (prevPage >= 1) {
            console.log('Going to prev page:', prevPage);
            self.loadData(prevPage);
        }
        return false;
    }

    self.goToNextPage = function() {
        console.log('goToNextPage called, current page:', self.currentPage());
        const nextPage = self.currentPage() + 1;
        if (nextPage <= self.totalPages()) {
            console.log('Going to next page:', nextPage);
            self.loadData(nextPage);
        }
        return false;
    }

    // --- ЛОГИКА КОРЗИНЫ (оставляем без изменений) ---
    self.addItem = function (product) {
        if (self.cartModel) {
            self.cartModel.addItem(product.id, product, (success) => {
                if (success) {
                    product.inCart(true);
                    product.amount(1);
                }
            });
        } else {
            console.error('cart is not init');
        }
    };

    self.increaseQuantity = function (product) {
        if (self.cartModel) {
            self.cartModel.updateAmount(product.id, 1, (success) => {
                if (success) {
                    product.amount(self.cartModel.getAmountProduct(product.id));
                }
            });
        }
    }

    self.decreaseQuantity = function (product) {
        if (self.cartModel) {
            self.cartModel.updateAmount(product.id, -1, (success) => {
                if (success) {
                    const newAmount = self.cartModel.getAmountProduct(product.id);
                    product.amount(newAmount);
                    if (newAmount === 0) {
                        product.inCart(false);
                    }
                }
            });
        }
    }
}

let catalogViewModel;
$(function () {
    console.log('Initializing catalog...');
    console.log('catalogData:', window.catalogData);
    console.log('cartData:', window.cartData);

    if (window.catalogData) {
        catalogViewModel = new CatalogViewModel();
        catalogViewModel.init(window.catalogData);

        // ВАЖНО: Привязываем ко всему main, чтобы захватить и форму, и список, и пагинацию
        ko.applyBindings(catalogViewModel, $('main')[0]);
        console.log('Catalog initialized successfully');
    } else {
        console.error('catalogData is not defined!');
    }
});
