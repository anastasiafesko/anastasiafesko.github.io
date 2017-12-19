(function ($) {

    //массив данных
    var services = [
        { problem: "Диагностика",price: "бесплатно", action: "заказать", type: "help" },
        { problem: "Выезд на дом",price: "бесплатно", action: "заказать", type: "help" },
        { problem: "Удалённая помощь",price: "бесплатно", action: "заказать", type: "help" },
        { problem: "Лечение вирусов",price: "20 BYN", action: "заказать", type: "soft" },
        { problem: "Переустановка ОС",price: "20 BYN", action: "заказать", type: "soft" },
        { problem: "Замена матрицы",price: "от 114 BYN", action: "заказать", type: "hard" },
        { problem: "Снятие забытого пароля",price: "20 BYN", action: "заказать", type: "soft" },
        { problem: "Замена клавиатуры",price: "от 60 BYN", action: "заказать", type: "hard" },
        { problem: "Настройка Wi-fi",price: "20 BYN", action: "заказать", type: "soft" },
        { problem: "Замена жесткого диска",price: "от 80 BYN", action: "заказать", type: "hard" },
        { problem: "Чистка ноутбука",price: "30 BYN", action: "заказать", type: "hard" }    
    ];

    //модель - данные приложения, здесь индивидуальный контакт с данными
    var Service = Backbone.Model.extend({}); // убрала код для default

    //коллекция - класс для управления группами моделей
    var Directory = Backbone.Collection.extend({
        model: Service //для каждого объекта модели используется класс Service
    });

    //представление - вывод данных в HTML
    //вывод каждого контакта
    var ServiceView = Backbone.View.extend({
        tagName: "article",
        className: "service-container",
        template: _.template($("#serviceTemplate").html()),

        render: function () { //передача шаблона
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    //еще одно представление - базовый шаблон
    var DirectoryView = Backbone.View.extend({
        el: $("#services1"), //выбираем #services1

        initialize: function () { //создать объект класса коллекции
            this.collection = new Directory(services);

            this.render(); //обработка шаблона
            //добавление элемента  select на страницу
            this.$el.find("#filter").append(this.createSelect());

            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.render, this);
        },

        render: function () {
            this.$el.find("article").remove();

            _.each(this.collection.models, function (item) {
                this.renderServise(item);
            }, this);
        },

        renderServise: function (item) {
            var serviceView = new ServiceView({
                model: item
            });
            this.$el.append(serviceView.render().el);
        },

        getTypes: function () { //извлекает уникальные типы
            return _.uniq(this.collection.pluck("type")); //возвращает массив, созданный с помощью Underscore uniq()
        }, // uniq принимает исходный массив и возвращает массив только с уникальными значениями
        //Сам массив, мы генерируем с помощью Backbone метода pluck(), который позволяет 
        //извлечь все значения атрибутов из коллекции моделей. 
        //Интересующий нас атрибут называется thetype
        createSelect: function () { //создает выпадающий список
            var select = $("<select/>", {
                    html: "<option value='all'>All</option>"
                });

            _.each(this.getTypes(), function (item) { //проходимся по каждому элементу массива
                var option = $("<option/>", { //создаем элемент option
                    value: item, 
                    text: item // задаем ему текст
                }).appendTo(select); // добавляем в селект
            });

            return select;
        },

        //Атрибут events принимает объект типа ключ:значение, где каждый ключ - это тип события; 
        //значение - селектор, к которому будет прикреплён наблюдатель события. 
        //В нашем случае мы хотим реагировать на изменение значения элемента <select> в контейнере с id #filter
        events: {
            "change #filter select": "setFilter"
        },

        //обработчик, который меняет значение filterType на значение которое выбрал пользователь
        setFilter: function (e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        },

        //реализация фильтра
        filterByType: function () {
            if (this.filterType === "all") {
                //просто выводим все объекты моделей, что у нас есть
                this.collection.reset(services);
                // обновляем URL после события
                servicesRouter.navigate("filter/all");
            } else {
                // чтобы событие не сработало сразу, а подождало, пока отфильтруются данные
                this.collection.reset(services, { silent: true });

                //запоминаем значение filtertype
                var filterType = this.filterType,
                //метод filter (underscore) принимает массив и фов, которая выполнится для каждого элемента
                    filtered = _.filter(this.collection.models, function (item) {
                        return item.get("type") === filterType;
                    });

                this.collection.reset(filtered);

                servicesRouter.navigate("filter/" + filterType);
            }
        }
    });

    //объект маршрутизатора - ContactsRouter
    //маршрутизация, отслеживает хэш изменения url
    var ServicesRouter = Backbone.Router.extend({
        routes: {
            // отслеживаем URL, который начинается с сова filter
            // и заканчивается чем-то другим, что попдает в фов
            "filter/:type": "urlFilter"
        },

        //фов, которая обновляет поле FilterType и вызывает событие фильтрации
        urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
        }
    });

    //создаем объект представления
    var directory = new DirectoryView();

    //создаем объект маршрутизатора
    var servicesRouter = new ServicesRouter();

    //активируем поддержку истории, чтобы менять URL при выборе опции в селекте
    Backbone.history.start();

} (jQuery)); //вызываем анонимно
