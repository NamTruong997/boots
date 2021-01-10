// Define data & common function
const MIN_LENGTH_INPUT_TRIGGER = 2;
const LENGTH_LIST_SUGGEST = 4;
const LENGTH_LIST_PRODUCT = 3;
const LENGTH_LIST_COLLECT = 2;
const MESSAGE_NOT_FOUND = 'No matching items';

const DEFINE_SEARCH = {
  suggestions: {
    headerName: 'Suggestion list',
    layout: '<a class="waves-effect waves-light"></a>',
    data: [],
    length: LENGTH_LIST_SUGGEST
  },
  collection: {
    headerName: 'Collection list',
    layout: '<a class="waves-effect waves-light"></a>',
    data: [],
    length: LENGTH_LIST_COLLECT
  },
  products: {
    headerName: 'Products list',
    layout: `<a class="waves-effect waves-light">
    <div class="block-product">
    <img class="image" src="https://im.uniqlo.com/images/common/pc/goods/435905/sub/435905_sub8.jpg"></img>
    <div class="wrapper">
      <h4 class="title"></h4>
      <div class="brand"></div>
      <div class="price"></div>
    </div>
  </div>
    </a>`,
    data: [],
    length: LENGTH_LIST_PRODUCT
  }
}

function debounce(func, waitTime) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;

    let executeFunction = function () {
      func.apply(context, args);
    };
    clearTimeout(timeout);

    timeout = setTimeout(executeFunction, waitTime);
  };
};

function highlightText(word) {
  let repl = `<span class="text-highlight"> ${inputVal}</span>`;
  return word = word.replace(inputVal, repl)
}

function checkInputLength(value, length = 1) {
  return value.length >= length
};

// Init element
let searchBar = $('.search-bar')
let boardElm = $('<div class="board-search card darken-1 l5"></div>');
let blockSuggestElm = $(`<ul class="block-suggest hide"></ul>`);
let inputVal = "";
let witdhSearchbar = $('.search-bar').width();
let boardDefine = {
  data: {
    suggestions: [],
    collection: [],
    products: []
  },
  stuctureProducts: {
    title: 'title',
    brand: 'brand',
    price: 'price',
    image: 'image',
    collection: 'collection'
  }
};
let preloaderElm = $(`<div class="preloader-wrapper small active hide">
<div class="spinner-layer spinner-blue-only">
  <div class="circle-clipper left">
    <div class="circle"></div>
  </div><div class="gap-patch">
    <div class="circle"></div>
  </div><div class="circle-clipper right">
    <div class="circle"></div>
  </div>
</div>
</div>`);

// Add element into DOM
boardElm.prepend(preloaderElm);
boardElm.append(blockSuggestElm);
searchBar.append(boardElm);

//Init event for Navbar mobile
$('.sidenav').sidenav();
$('.tap-target').tapTarget()
$('.tap-target').tapTarget('open')

function generateCustomLayout(data, layout) {
  let layoutRemp = $(layout);
  for (const key in data) {
    layoutRemp.find(`.${key}`).text(data[key])
  }
  return layoutRemp.prop('outerHTML');
}

function generateSuggestElm(headerName, data, layout) {
  return $(`<li>
  <div class="suggest-header">${headerName}</div>
  <div class="suggest-body">
    ${data.map(element => {
    return typeof element === "string" ? $(layout).append(highlightText(element)).prop('outerHTML') : generateCustomLayout(element, layout);
  }).join('')}
  </div>
</li>`)
}

function convertData(str) {
  let {
    data,
    stuctureProducts
  } = boardDefine;

  data.suggestions = {
    data: sugguestions.filter((title) => title.includes(str))
  };
  data.collection = {
    data: sugguestCollection.filter((collect) => collect.toLowerCase().includes(str))
  }

  //Filter by title from stuctureProducts
  data.products = {
    data: dataJson
      .map((item) => ({
        ...item,
        [stuctureProducts.title]: item[stuctureProducts.title] + item[stuctureProducts.collection]
      }))
      .filter((product) => product[stuctureProducts.title].toLowerCase().includes(str))
  }
  return {
    result: data,
    isEmpty: data.collection.data.length + data.products.data.length + data.suggestions.data.length === 0
  };
};

function generateBlSuggest(convertedData) {
  let mergeData = JSON.parse(JSON.stringify(DEFINE_SEARCH));
  let renderedSuggestBl = ``;

  $.extend(true, mergeData, convertedData);

  for (const key in mergeData) {
    let elmData = mergeData[key];
    // If data of one type is empty => Do not generate this type
    if (elmData.data.length) {
      renderedSuggestBl += generateSuggestElm(elmData.headerName, elmData.data.slice(0, elmData.length), elmData.layout).prop('outerHTML');
    }
  }

  //Last one - Add section more products
  let moreProductLength = mergeData.products.data.length - LENGTH_LIST_PRODUCT;
  renderedSuggestBl += $(`<li class="block-more-products">
  <a class="waves-effect waves-light">VIEW ALL ${moreProductLength} PRODUCTS$</li></a>
  `).prop('outerHTML');

  return renderedSuggestBl
};

// Listen when user typing
$('.search-elm').on('keydown', debounce((e) => {
  preloaderElm.removeClass('hide');
  blockSuggestElm.addClass('hide')

  inputVal = e.target.value;

  if (checkInputLength(inputVal, MIN_LENGTH_INPUT_TRIGGER)) {

    // Set timeout will be like fake API
    setTimeout(() => {
      // Prepare data
      let { result, isEmpty } = convertData(inputVal);
      blockSuggestElm.empty();

      if (!isEmpty) {
        blockSuggestElm.append(generateBlSuggest(result))
      } else {
        blockSuggestElm.append(`<a class="waves-effect waves-light nomatching-text">${MESSAGE_NOT_FOUND}</a>`)
      }

      $('.material-icons.icon-menu').addClass('hide');
      preloaderElm.addClass('hide');
      blockSuggestElm.removeClass('hide')
    }, 500);
  }

  // When input empty, hide the suggest board 
  if (inputVal === "") {
    preloaderElm.addClass('hide');
  }

}, 300));

// Mobile - Handle click on search icon - close icon
$('.search-icon-mobile, .close-icon-mobile').on('click', () => {
  $('.search-wrapper.mobile').toggleClass('active')
  $('.close-icon-mobile, .search-input-mobile').toggleClass('hide')
})

$('.search-bar').on('click', function () {
  if ($('html').width() < 992) {
    $(this).width('100vw')
    $(this).find('.search-elm').focus();
  }

})

// Reset board suggest when click outside or close icon
$(document).on('click', function (e) {
  let isInside = $('.search-bar').find(e.target).length;

  // Click outside - hide all suggest
  if (!isInside) {
    $('.material-icons.icon-menu').removeClass('hide');
    blockSuggestElm.addClass('hide');
    blockSuggestElm.empty();
    $('html').width() < 992 ? $('.search-bar').width(55) : $('.search-bar').width(300)
    return;
  }

  if ($(e.target).hasClass('material-icons icon-close')) {
    blockSuggestElm.addClass('hide');
    blockSuggestElm.empty();
    $('.search-elm').val("")
  }
});


$(window).on('resize', debounce(() => {
  $('body').click()
}, 50))
