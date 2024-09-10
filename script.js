const modal = document.getElementById("modal")
const modalShow = document.getElementById("show-modal")
const modalClose = document.getElementById("close-modal")
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name")
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");
const darkModeBtn = document.getElementById("dark-mode-btn");
const alertContainer = document.querySelector('.alert-container');
const searchInput = document.querySelector(".search-input .form-control")
const reloadBtn = document.querySelector(".reload-btn");
const loaderEl = document.querySelector(".loader-wrapper");
const themeChangerBtn = document.querySelector(".theme-changer-btn")
let darkModeBtnIcon = darkModeBtn.querySelector('i');


darkModeBtn.addEventListener('click' , () => {
     darkModeBtnIcon.className = darkModeBtnIcon.className.includes("fa-moon") ? "fas fa-sun" : 'fas fa-moon';
    let isDark = darkModeBtnIcon.className.includes("fa-moon") 
    console.log(isDark);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem("theme-color" , isDark ? 'dark-mode' : 'light-mode')
});


let bookmarks = [];

// show modal 
const showModal = () => {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

// validate form
const validate = (nameValue , urlValue) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue) {
        alert("Please submit values for both fields")
        return false;
    }

    if(!urlValue.match(regex)) {
        alert("please provide a valid website address !");
        return false;
    }

    const bookmark = {
        name:nameValue,
        url:urlValue,
    };

    bookmarks.push(bookmark);
    console.log(bookmarks);
    localStorage.setItem("bookmarks" , JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset();
    websiteNameEl.focus();

    // valid
    return true;
    
}

// update DOM 
const buildBookmarks = () => {
    bookmarksContainer.innerHTML = '';
    bookmarks.forEach((bookmark) => {
        const {name,url} = bookmark;
        bookmarksContainer.innerHTML += `
         <div class="card">
                <div class="card-body">
                    <img class="card-img" src="https://www.google.com/s2/favicons?domain=${url}" alt=${name}>
                    <a class="card-link" href=${url} target="_blank">
                        ${name}
                        <i class="fa fa-chevron-right"></i>
                    </a>
                </div>
                <div class="card-buttons">
                    <button onclick="copyLink('${url}')" title="copy the link" class="btn card-copy-btn">
                        <i class="fa fa-copy"></i>
                    </button>
                    <button onclick="deleteBookmark('${url}')" title="delete the link" class="btn card-delete-btn">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        
        `
    })
}

// fetching bookmarks objects from localStorage
const fetchBookmarks = () => {
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    } else{
        bookmarks = [
            {
                name:"java script info website",
                url:'https://winbot.ir',
            }
        ];

        localStorage.setItem("bookmarks" , JSON.stringify(bookmarks))
        fetchBookmarks()
    }
    // console.log(bookmarks);
    buildBookmarks()
}

// delete bookmark Handler
const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark ,  index) => {
        if(bookmark.url === url) {
            bookmarks.splice(index,1);
        }
    });
    localStorage.setItem("bookmarks",  JSON.stringify(bookmarks));
    buildBookmarks();
    appendAlertBoxes('Deleted successfully !')
}

// replace https:// and http:// if user enters a URL
const storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes("http://" , "https://")) {
        urlValue = `https://${urlValue}`;
    } else{
        urlValue = urlValue;
    }
    // console.log(nameValue , urlValue);

    if(!validate(nameValue, urlValue)) {
        return false;
    }
}


// apply dark mode and change theme color based on localStorage value
const checkThemeColor = () => {
    // dark mode 
    let isDark = localStorage.getItem('theme-color');
    if(isDark === 'dark-mode') {
        document.body.classList.add('dark-mode');
        darkModeBtnIcon.className = 'fas fa-moon';
    } else{
        document.body.classList.remove('dark-mode')
        darkModeBtnIcon.className = 'fas fa-sun';
    }
}


// copy saved message's link
const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    appendAlertBoxes('link copied successfully !')
}


// apped alers into alert container 
const appendAlertBoxes = (alertValue) => {
    // Create a unique alert ID (optional)
    const alertId = `alert-${Math.round(Math.random() * 100)}`;

    // Create the alert HTML dynamically
    const alertHtml = `
      <div class="alert" id="${alertId}">
        <h2 class="alert-title">${alertValue}</h2>
        <!-- Check -->
        <div class="checkbox-wrapper">
          <div class="cbx">
            <input id="checkbox-${alertId}" checked type="checkbox"/>
            <label for="checkbox-${alertId}"></label>
            <svg width="15" height="14" viewbox="0 0 15 14" fill="none">
              <path d="M2 8.36364L6.23077 12L13 2"></path>
            </svg>
          </div>
          <!-- Gooey-->
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
              <filter id="goo-${alertId}">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"></feGaussianBlur>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" result="goo-12"></feColorMatrix>
                <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    `;

    // Append the alert to the container
    alertContainer.innerHTML += alertHtml;

    // Set a timeout to remove the alert after 3 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove()
        }
    }, 2000);
}

//search among the notes funtion
searchInput.addEventListener("keyup" , () => {
    let searchInputValue = searchInput.value;

    let filteredCards = bookmarks.filter((item) => {
        return item.name.toLowerCase().startsWith(searchInputValue.toLocaleLowerCase());
    });

    generateWords(filteredCards);

})


// generate searching words
const generateWords = (wordsArray) => {

    let savedCardsArray = wordsArray.map((word) => {
        const {name,url} = word;
      return ` 
            <div class="card">
                <div class="card-body">
                    <img class="card-img" src="https://www.google.com/s2/favicons?domain=${url}" alt=${name}>
                    <a class="card-link" href=${url}>
                        ${name}
                        <i class="fa fa-chevron-right"></i>
                    </a>
                </div>
                <div class="card-buttons">
                    <button onclick="copyLink('${url}')" title="copy the link" class="btn card-copy-btn">
                        <i class="fa fa-copy"></i>
                    </button>
                    <button onclick="deleteBookmark('${url}')" title="delete the link" class="btn card-delete-btn">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `
    }).join('');
  
  
    if(savedCardsArray.length) {
        bookmarksContainer.innerHTML = savedCardsArray;
    } else{
        bookmarksContainer.innerHTML = `
            <h2 class="error-text">NOT FOUND :((</h2>
        `
    }
  
  }

// changing theme
let current = 0;
const themeChange = () => {
    current++;
    // console.log(current);
    if(current > allThemes.length - 1) {
        current = 0;
    }
    console.log(`${allThemes[current].src}`);
    document.body.style.backgroundImage = `url("${allThemes[current].src}")`;
    localStorage.setItem("bodyTheme" , JSON.stringify(allThemes[current].src));
}

// Event listeners
modalShow.addEventListener("click" , showModal);
modalClose.addEventListener("click" , () => modal.classList.remove('show-modal'))
window.addEventListener("click" , (e) => e.target === modal ? modal.classList.remove('show-modal') : false);
themeChangerBtn.addEventListener("click" , themeChange);
bookmarkForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    storeBookmark(e);
    modal.classList.remove("show-modal")
});

window.addEventListener("load" , () => {
    searchInput.focus();
    loaderEl.classList.remove('active')
})
reloadBtn.addEventListener("click" , () => {
    reloadBtn.style.transform = "rotate(360deg)";
    setTimeout(() => {
        window.location.reload();
    }, 500);
})

const checkBodyTheme = () => {
    let bodyTheme = localStorage.getItem('bodyTheme');
    document.body.style.backgroundImage = `url(${bodyTheme})`
}


// load and fetch bookmarks from localStorage
fetchBookmarks();
checkThemeColor();
checkBodyTheme();
