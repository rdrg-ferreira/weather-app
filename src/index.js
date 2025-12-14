import "./styles.css";

function createApp() {
    const getLocationData = async (location) => {
        try {
            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&include=current&key=MECHH3G8NEFPFDTF62XB8HY7T&contentType=json`);

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const processData = (data) => {
        return {
            address: data.resolvedAddress,
            temp: data.currentConditions.temp,
            feelslike: data.currentConditions.feelslike,
            humidity: data.currentConditions.humidity,
            windspeed: data.currentConditions.windspeed,
            datetime: data.currentConditions.datetime
        }
    }

    const getData = async (location) => {
        const data = await getLocationData(location);
        return processData(data);
    }

    return {
        getData,
    }
}

const screen = (function () {
    const app = createApp();
    const form = document.querySelector("form");
    const changeMetricButtons = document.querySelectorAll("#change-temp-metric > button");
    let currentMetric = "C";

    const changeTempMetric = (newMetric) => {
        if (newMetric === currentMetric) return;

        // change values
        const temps = document.querySelectorAll(".temp > .value");
        temps.forEach(t => {
            if (newMetric === "C") {
                t.textContent = ((parseFloat(t.textContent) - 32) * (5/9))
                    .toFixed(1);
            }
            else {
                t.textContent = (parseFloat(t.textContent) * (9/5) + 32)
                    .toFixed(1);
            }
        });

        // change metric displays
        const metrics = document.querySelectorAll(".temp > .metric");
        metrics.forEach(m => m.textContent = `°${newMetric}`);

        currentMetric = newMetric;
    }

    const updateDisplay = (data) => {
        // temp
        const temp = document.querySelector("#temp > .value");
        if (currentMetric === "F") data.temp = data.temp * (9/5) + 32;
        temp.textContent = data.temp;

        // address
        const address = document.querySelector("#address");
        address.textContent = data.address;

        // time
        const time = document.querySelector("#time");
        time.textContent = data.datetime;

        // feelslike
        const feelslike = document.querySelector("#feelslike > .value");
        if (currentMetric === "F") data.feelslike = data.feelslike * (9/5) + 32;
        feelslike.textContent = data.feelslike;

        // humidity
        const humidity = document.querySelector("#humidity > .value");
        humidity.textContent = data.humidity;

        // wind speed
        const windSpeed = document.querySelector("#wind-speed > .value");
        windSpeed.textContent = data.windspeed;
    }

    // event listeners
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = Object.fromEntries(new FormData(form).entries());
        const data = await app.getData(inputs["location"])
        
        updateDisplay(data);
    });

    changeMetricButtons[0].addEventListener("click", () => changeTempMetric("C"));
    changeMetricButtons[1].addEventListener("click", () => changeTempMetric("F"));

    (async () => {
    const data = await app.getData("Coimbra");
    updateDisplay(data);
    document.querySelector("main").classList.remove("invisible");
    })();
})();