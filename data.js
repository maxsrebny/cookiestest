/* Демо-данные прототипа cream cookies club.
   Цены и остатки условные, заменить на реальные. */
window.CC_DATA = {
  // Тестовый бот. Можно переопределить параметром ?bot=имя_bot в адресе мини-приложения
  botUsername: 'cookiestest_demo_bot',
  brand: { name: 'cream cookies', sub: 'кремовое печенье', club: 'club' },

  user: {
    name: 'Максим',
    phone: '+7 ••• ••• 42-17',
    code: 'CC-0127',
    founderNo: 127,
    visits: 12,
    balance: 480,
    birthday: '',
    tastes: ['карамель', 'фисташка'],
    notify: true
  },

  levels: [
    { id: 'kroshka',  name: 'Крошка',   minVisits: 0,  cashback: 5,  perks: ['5% бонусами с каждого чека', 'Подарок в день рождения'] },
    { id: 'pechenka', name: 'Печенька', minVisits: 5,  cashback: 7,  perks: ['7% бонусами', 'Миссии и коллекция', 'Подарок в день рождения'] },
    { id: 'krem',     name: 'Крем',     minVisits: 15, cashback: 10, perks: ['10% бонусами', 'Секретное меню', 'Ранний доступ к дропам'] },
    { id: 'legend',   name: 'Легенда',  minVisits: 30, cashback: 12, perks: ['12% бонусами', 'Дегустации новинок первыми', 'Именной подарок-бокс'] }
  ],

  categories: [
    { id: 'all', name: 'Все' },
    { id: 'cookies', name: 'Печенье' },
    { id: 'drinks', name: 'Напитки' },
    { id: 'sets', name: 'Сеты' },
    { id: 'gifts', name: 'Подарки' }
  ],

  products: [
    { id: 'beauty',   cat: 'cookies', name: '«Бьюти»',          full: '«Бьюти» печенье',            price: 310, img: 'assets/beauty.jpg',   hit: true,
      desc: 'Малиновая песочная основа с белым шоколадом внутри, сливочный крем, сублимированная малина', tags: ['ягоды', 'белый шоколад'] },
    { id: 'snickers', cat: 'cookies', name: '«Сникерс»',        full: 'Печенье «Сникерс»',          price: 290, img: 'assets/snickers.jpg',
      desc: 'Шоколадный ганаш, мягкое песочное тесто с обжаренным арахисом, карамель и кусочки сникерса', tags: ['карамель', 'орехи', 'шоколад'] },
    { id: 'double',   cat: 'cookies', name: '«Двойной шоколад»', full: 'Печенье «Двойной шоколад»',  price: 290, img: 'assets/double.jpg',
      desc: 'Шоколадно-ванильная песочная основа, сливочный крем на белом шоколаде, шоколадный ганаш', tags: ['шоколад'] },
    { id: 'lemon',    cat: 'cookies', name: '«Лимон + мак»',    full: 'Печенье «Лимон + мак»',      price: 280, img: 'assets/lemon.jpg',
      desc: 'Мягкое песочное тесто с маком, сливочный крем на белом шоколаде, лимонное кули с цедрой', tags: ['цитрус'] },
    { id: 'praga',    cat: 'cookies', name: '«Прага»',          full: 'Бисквитно-песочное «Прага»', price: 300, img: 'assets/praga.jpg',
      desc: 'Шоколадное бисквитно-песочное тесто, шоколадный крем с какао, шоколадный ганаш', tags: ['шоколад'] },
    { id: 'nut',      cat: 'cookies', name: '«Ореховое»',       full: 'Печенье «Ореховое»',         price: 300, img: 'assets/nut.jpg',
      desc: 'Тесто с обжаренным солёным арахисом, сливочный крем, арахисовая паста с кусочками орехов, фисташка', tags: ['орехи', 'фисташка'] },
    { id: 'cocoa',    cat: 'drinks',  name: 'Какао с маршмеллоу', full: 'Какао с маршмеллоу',       price: 250, img: 'assets/cocoa.jpg',
      desc: 'Уютный согревающий напиток с нежными маршмеллоу', tags: ['шоколад'] },
    { id: 'latte',    cat: 'drinks',  name: 'Тыквенный латте',  full: 'Холодный пряный тыквенный латте', price: 320, img: 'assets/latte.jpg', seasonal: true,
      desc: 'С шапкой взбитых сливок, корицей и карамелью. Только в осеннем меню', tags: ['карамель', 'сезон'] },
    { id: 'set-duo',  cat: 'sets',    name: 'Сет «Дуэт»',       full: 'Сет «Дуэт»',                 price: 520, img: 'assets/story-1.jpg',
      desc: 'Любое печенье и напиток на выбор. Выгода 70 ₽', tags: ['выгодно'] },
    { id: 'cert',     cat: 'gifts',   name: 'Сертификат 1000 ₽', full: 'Подарочный сертификат',     price: 1000, img: 'assets/logo.jpg',
      desc: 'Отправляется другу прямо в Telegram, действует 6 месяцев', tags: ['подарок'] }
  ],

  drop: {
    label: 'Дроп дня',
    title: 'Осеннее меню спешл',
    subtitle: 'Тыквенный латте и печенье недели «Пряная тыква»',
    img: 'assets/autumn.jpg',
    total: 40,
    left: 17,
    endHour: 20
  },

  missions: [
    { id: 'm1', title: 'Попробуй 3 вкуса недели', progress: 2, total: 3, reward: '+150 ₽ бонусов', icon: 'flame' },
    { id: 'm2', title: '3 визита в октябре',      progress: 1, total: 3, reward: 'Бейдж «Осенний» и 100 ₽', icon: 'clock' },
    { id: 'm3', title: 'Кофе + печенье',          progress: 1, total: 1, reward: '+50 ₽', icon: 'check', done: true }
  ],

  collection: {
    title: 'Коллекция «Осень»',
    reward: 'Секретное печенье в подарок',
    items: [
      { id: 'beauty',   got: true },
      { id: 'snickers', got: true },
      { id: 'double',   got: true },
      { id: 'praga',    got: true },
      { id: 'lemon',    got: false },
      { id: 'nut',      got: false }
    ]
  },

  secret: [
    { name: '«Прага» XXL', hint: 'Откроется на уровне «Крем»', img: 'assets/praga.jpg', level: 2 },
    { name: 'Секретный вкус #04', hint: 'Только для Легенд', img: 'assets/beauty.jpg', level: 3 }
  ],

  subscription: { title: 'Абонемент на 10 печений', left: 6, total: 10, saved: 290 },

  orders: [
    { id: 'A-16', date: '28 сен, 18:40', items: '«Бьюти» ×2, какао', sum: 870, status: 'done' },
    { id: 'A-11', date: '21 сен, 12:15', items: '«Сникерс», тыквенный латте', sum: 610, status: 'done' },
    { id: 'A-07', date: '14 сен, 16:05', items: 'Сет «Дуэт»', sum: 520, status: 'done' }
  ],

  staffOps: [
    { time: '17:42', guest: 'Алина · Крем',      type: 'accrue', sum: 620, bonus: 62 },
    { time: '17:31', guest: 'Денис · Крошка',    type: 'accrue', sum: 290, bonus: 15 },
    { time: '17:15', guest: 'Мария · Печенька',  type: 'redeem', sum: 200, bonus: -200 },
    { time: '16:58', guest: 'Заказ A-15',        type: 'order',  sum: 870, bonus: 0 }
  ]
};
