const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// input
const searchText = $(".search-text");
const searchBtn = $(".search_btn");

// render city
const countryName = $(".country-name");
const cityName = $(".city_name");

// render temp
const tempMax = $(".temp_max");
const tempMin = $(".temp_min");
const weatherTempTitle = $$(".weather-temp-title");
const cityTemp = $(".city_temp");

// render wind-speed
const windDirection = $(".wind-direction");

// desc
const statusDesc = $$(".status-desc");
const cityStatus = $(".city_status");

// wind percent
const windValue = $(".wind_value");
const windPercent = $(".wind-percent");
const windBlockPercent = $(".wind_block-range-percent");

// position fixed
const weatherStatus = $(".weather-status");
const forcast = document.getElementById("forecast");
const content = document.getElementById("content");
const nav = document.getElementById("nav");

// media
const a = window.matchMedia("(max-width: 1023px)");
const x = window.matchMedia("(max-width: 900px)");
const y = window.matchMedia("(max-width: 610px)");

// toast
const toastMain = document.getElementById("toast");

// click nav
const navIcon = $$(".nav_icon");

// chart
const chartHour = $$(".chart_hour");
const chartItemIcon = $$(".chart_item-icon");
const chartTemp = $$(".chart_temp");

// Time Block
const timeBlockBg = $(".timeblock_bg");
const sunRiseTime = $(".sunrise_time-value");
const sunSetTime = $(".sunset_time-value");

const sundayIcon = $(".sunday_icon");

// tomorrow forecast
const tomorrowPosition = $(".tomorrow_position");
const tomorrowTemp = $(".tomorrow_temp");
const tomorrowDesc = $(".tomorrow_desc");

// test
const weatherIcon = $(".weather-icon");

// snowfall
const snow = document.getElementById("snow");

console.log(sundayIcon);

// toast info
const types = {
  success: {
    type: "success",
    title: "Success",
    icon: "check",
    findReport: "Đã load khu vực thành công",
  },
  error: {
    type: "error",
    title: "error",
    icon: "xmark",
    findReport: "Không tìm thấy vùng cần tìm!",
  },
  update: {
    type: "update",
    title: "update",
    icon: "exclamation",
    findReport: "Tính năng đang cập nhật",
  },
};

// weather-icon
const weatherIconLists = {
  sunCloud: {
    icon: '<i class="fa-solid fa-cloud-sun"></i>',
    class: "sun_cloud_icon",
    bgImage: "https://i.gifer.com/BwqK.gif",
  },
  cloud: {
    icon: '<i class="fa-solid fa-cloud"></i>',
    class: "cloud_icon",
    bgImage: "https://i.makeagif.com/media/4-11-2015/7OpzWU.gif",
  },
  rain: {
    icon: '<i class="fa-solid fa-cloud-rain"></i>',
    class: "rain_icon",
    bgImage: "https://i.gifer.com/QAOA.gif",
  },
  snowWeather: {
    icon: '<i class="fa-regular fa-snowflake"></i>',
    class: "snow_icon",
    bgImage: "https://i.imgur.com/pPKZz0Q.gif",
  },
};

// App
const app = {
  apiKey: "3951debfc7837f0ed4957d5c6361c419",
  darkMode: false,
  snowLength: 50,

  render: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lon = position.coords.longitude;
        let lat = position.coords.latitude;
        let apiCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
        fetch(apiCurrent)
          .then((res) => {
            return res.json();
          })
          .then((data) => this.weatherReport(data));
      });
    }
  },

  weatherReport: function (data) {
    const urlWeatherReport = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${this.apiKey}`;
    fetch(urlWeatherReport)
      .then((res) => {
        return res.json();
      })
      .then((forecastData) => {
        // log
        console.group("data");
        console.log("data: ");
        console.log(data);
        console.log("forecast: ");
        console.log(forecastData);
        console.groupEnd();

        // props
        const cityData = forecastData.city;
        const mainData = data.main;
        const statusData = data.weather[0];
        const windData = data.wind;
        const chartList = forecastData.list;
        const timeSun = data.sys;

        // render city
        countryName.innerText = cityData.name;
        cityName.innerText = `${cityData.name}, ${cityData.country}`;

        // render temp
        const maxTempC = Math.floor(mainData.temp_max - 273);
        const minTempC = Math.floor(mainData.temp_min - 273);
        const tempDefault = Math.floor(mainData.temp - 273);
        const maxTempCText = `${maxTempC}<sup>o</sup>C`;
        const minTempCText = `${minTempC}<sup>o</sup>C`;
        const tempDefaultText = `${tempDefault}<sup>o</sup>C`;
        tempMax.innerHTML = `${maxTempCText}`;
        tempMin.innerHTML = `${minTempCText}`;
        cityTemp.innerHTML = `${tempDefaultText}`;

        // render status
        weatherTempTitle.forEach((item) => {
          item.innerText = statusData.description;
        });
        cityStatus.innerText = statusData.main;

        // render bg follow weather
        switch (statusData.main) {
          case "Clouds":
            weatherStatus.style.backgroundImage = `url(${weatherIconLists.cloud.bgImage})`;
            break;

          case "Rain":
            weatherStatus.style.backgroundImage = `url(${weatherIconLists.rain.bgImage})`;
            break;

          case "Snow":
            weatherStatus.style.backgroundImage = `url(${weatherIconLists.snowWeather.bgImage})`;
            break;

          default:
            weatherStatus.style.backgroundImage = `url(${weatherIconLists.sunCloud.bgImage})`;
            break;
        }

        // render wind-speed
        const windSpeed = Math.floor((windData.speed * 18) / 5);
        windDirection.innerText = `${windSpeed}km`;

        // render weather desc
        const pressure = mainData.pressure;
        const visibility = data.visibility;
        const humidity = mainData.humidity;

        statusDesc[0].innerText = `${pressure} hPa`;
        statusDesc[1].innerText = `${visibility / 1000} km`;
        statusDesc[2].innerText = `${humidity} %`;

        // render clouds percent
        const cloudPecent = data.clouds.all;
        windValue.innerText = `${cloudPecent}%`;
        windPercent.style.left = `calc(${cloudPecent}% - 18px)`;
        windBlockPercent.style.width = `${cloudPecent}%`;

        // time block
        const cityCurrentTime = Math.round(
          ((data.dt - data.sys.sunrise) /
            (data.sys.sunset - data.sys.sunrise)) *
            100
        );
        timeBlockBg.style.width = `${cityCurrentTime}%`;
        const sundayWidth = cityCurrentTime - 4;
        if (sundayWidth > 100) {
          sundayIcon.style.left = `81%`;
        } else if (sundayWidth < 12) {
          sundayIcon.style.left = `12%`;
        } else {
          sundayIcon.style.left = `${cityCurrentTime - 4}%`;
        }

        // sunrise and set;
        const sunRiseTimeFormat = timeSun.sunrise;
        const sunSetTimeFormat = timeSun.sunset;
        const sunRiseHour = new Date(sunRiseTimeFormat * 1000).getHours();
        const sunRiseMinutes = new Date(sunRiseTimeFormat * 1000).getMinutes();
        const sunSetHour = new Date(sunSetTimeFormat * 1000).getHours();
        const sunSetMinutes = new Date(sunSetTimeFormat * 1000).getMinutes();

        sunRiseTime.innerText = `0${sunRiseHour}:${sunRiseMinutes} am`;
        sunSetTime.innerText = `${sunSetHour}:${sunSetMinutes} pm`;

        // tomorrow
        tomorrowPosition.innerText = data.name;
        tomorrowTemp.innerHTML = `${tempDefault}<sup>o</sup>C`;
        tomorrowDesc.innerText = statusData.description;

        // chart
        for (let i = 0; i <= 5; i++) {
          const dtTime = chartList[i].dt;
          const weatherChart = chartList[i].weather;
          const tempChart = chartList[i].main;

          const time = new Date(dtTime * 1000);
          const hour = time.getHours();
          const temp = Math.floor(tempChart.temp - 273);

          // time
          chartHour[i].innerText = `${hour < 10 ? "0" + hour : hour}`;

          // icon

          switch (weatherChart[0].main) {
            case "Rain":
              chartItemIcon[i].innerHTML = weatherIconLists.rain.icon;
              chartItemIcon[i].classList.add("rain_icon");
              break;

            case "Clouds":
              chartItemIcon[i].innerHTML = weatherIconLists.cloud.icon;
              chartItemIcon[i].classList.add("cloud_icon");
              break;
            case "Snow":
              chartItemIcon[i].innerHTML = weatherIconLists.snowWeather.icon;
              chartItemIcon[i].classList.add("snow_icon");
              break;

            default:
              chartItemIcon[i].innerHTML = weatherIconLists.sunCloud.icon;
              chartItemIcon[i].classList.add("sun_cloud_icon");
              break;
          }

          // temp
          chartTemp[i].innerHTML = `${temp}<sup>o</sup>C`;
        }
      });
  },

  // handler
  handleInput: function () {
    searchText.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        const value = searchText.value.trim();
        this.renderSearch(value);
        searchText.value = "";
      }
    });
  },

  renderSearch: function (input) {
    if (input) {
      const apiSearch = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${this.apiKey}`;
      fetch(apiSearch)
        .then((res) => {
          return res.json();
        })
        .then((searchData) => {
          // error 404
          if (searchData.cod == 404) {
            this.handleToast(types.error);
            return;
          }
          this.handleToast(types.success);
          this.weatherReport(searchData);
        });
    }
  },

  handleScroll: function () {
    window.onscroll = () => {
      const windowTop = window.scrollY;
      const weatherStatusTop = weatherStatus.offsetTop;

      if (a.matches) {
        if (windowTop >= weatherStatusTop) {
          forcast.classList.add("forecast-fixed");

          nav.classList.add("nav-fixed");

          content.classList.add("content-margin");
        } else {
          forcast.classList.remove("forecast-fixed");

          nav.classList.remove("nav-fixed");

          content.classList.remove("content-margin");
          content.style.paddingLeft = "0";
        }
      }

      if (x.matches) {
        if (forcast.classList.contains("forecast-fixed")) {
          forcast.classList.remove("forecast-fixed");
          content.classList.remove("content-margin");
          content.style.paddingLeft = "105px";
        }
      }

      if (y.matches) {
        if (nav.classList.contains("nav-fixed")) {
          nav.classList.remove("nav-fixed");
          content.style.paddingLeft = "0";
        }
      }
    };
  },

  handleToast: function (type) {
    if (toastMain) {
      const delayTime = 2; // s
      const showTime = 0.5;

      const toast = document.createElement("div");
      toast.classList.add("toast", `toast_${type.type}`);

      toast.style.animation = `toastSlideIn ${showTime}s ease, toastFadeOut ${showTime}s ${delayTime}s forwards`;

      toast.innerHTML = `
                <div class="toast_icon toast_icon-${type.type}">
                   <i class="fa-solid fa-${type.icon} toast_icon-img"></i>
               </div>
               <div class="toast_contains">
                   <div class="toast_title">
                       ${type.title}
                   </div>
                   <div class="toast_desc">
                       ${type.findReport}
                   </div>
               </div>
                <div class="toast_close">
                   <i class="fa-solid fa-xmark toast_close-img"></i>
                </div>`;

      toastMain.appendChild(toast);
      setTimeout(() => {
        toastMain.removeChild(toast);
      }, (delayTime + showTime) * 1000);
    }
  },

  handleClick: function () {
    for (
      let navIconItem = 1;
      navIconItem <= navIcon.length - 2;
      navIconItem++
    ) {
      navIcon[navIconItem].addEventListener("click", () => {
        this.handleToast(types.update);
      });
    }

    // searchInput
    searchBtn.addEventListener("click", () => {
      const textValue = searchText.value.trim();
      this.renderSearch(textValue);
      searchText.value = "";
    });

    // toggle dark mode
    const toggleDarkModeBtn = navIcon[5];
    toggleDarkModeBtn.addEventListener("click", () => {
      if (this.darkMode) {
        this.darkMode = !this.darkMode;
        document.body.dataset.theme = "light";
        console.log("Light Mode");
      } else {
        this.darkMode = !this.darkMode;
        document.body.dataset.theme = "dark";
        console.log("Dark Mode");
      }
    });
  },

  // snowfall
  handleSnowFall: function () {
    if (snow) {
      for (let index = 0; index < this.snowLength; index++) {
        const snowDiv = document.createElement("div");
        snowDiv.id = "s" + index;
        snowDiv.className = `snow_flake`;

        const randomLeft = Math.random() * 100;
        const fallSpeed = Math.random() * 10 + 10;
        const animationDelayTime = Math.random() * 10;
        const animatePositionLeft = Math.random() * 20 - 10;
        const animatePositionLeftEnd = Math.random() * 20 - 10;
        const size = Math.random() * 5 * 0.25;

        snowDiv.style.left = `${randomLeft}vw`;
        snowDiv.style.animation = `snowFall ${fallSpeed}s linear infinite`;
        snowDiv.style.animationDelay = `-${animationDelayTime}s`;
        snowDiv.style.setProperty(
          "--left-animate-position",
          animatePositionLeft + "vw"
        );
        snowDiv.style.setProperty(
          "--left-end-animate-position",
          animatePositionLeftEnd + "vw"
        );
        snowDiv.style.setProperty("--size", size + "vw");

        snowDiv.style.filter = `blur(1px)`;
        snow.appendChild(snowDiv);
      }
    }
  },
  start: function () {
    this.render();
    this.handleInput();
    this.handleScroll();
    this.handleClick();
    this.handleSnowFall();
  },
};
app.start();
