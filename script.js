const searchButton =
document.getElementById("searchButton");

const searchInput =
document.getElementById("searchInput");

const loading =
document.getElementById("loading");

const result =
document.getElementById("result");

let currentBond = null;

searchButton.addEventListener(

    "click",

    searchBond

);

searchInput.addEventListener(

    "keydown",

    function(event){

        if(event.key==="Enter"){

            searchBond();

        }

    }

);

async function searchBond(){

    const query =
    searchInput.value.trim();

    if(query===""){

        alert("Введите ISIN");

        return;

    }

    loading.style.display="flex";

    result.classList.add("hidden");

    try{

        const response =
        await fetch(
        `/api/bond?query=${encodeURIComponent(query)}`
        );

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            loading.style.display="none";

            return;

        }

        currentBond =
        data.bond;
                document.getElementById(

            "bondName"

        ).textContent =

            currentBond.name;

        document.getElementById(

            "bondIsin"

        ).textContent =

            currentBond.isin;

        document.getElementById(

            "price"

        ).textContent =

            currentBond.price.toFixed(2) + "%";

        document.getElementById(

            "aci"

        ).textContent =

            currentBond.aci.toFixed(2);

        document.getElementById(

            "nominal"

        ).textContent =

            currentBond.nominal.toLocaleString() +

            " " +

            currentBond.currency;

        document.getElementById(

            "coupon"

        ).textContent =

            currentBond.coupon +

            " " +

            currentBond.currency;

        document.getElementById(

            "maturity"

        ).textContent =

            currentBond.maturity ||

            "Нет данных";

        document.getElementById(

            "offer"

        ).textContent =

            currentBond.offer ||

            "Нет оферты";

        document.getElementById(

            "yto"

        ).textContent =

            currentBond.yieldToOffer > 0

            ? currentBond.yieldToOffer.toFixed(2) + "%"

            : "—";

        calculate();
                result.classList.remove("hidden");

    }

    catch(error){

        console.error(error);

        alert("Ошибка получения данных.");

    }

    finally{

        loading.style.display = "none";

    }

}

const quantityInput =
document.getElementById("quantity");

const customPriceInput =
document.getElementById("customPrice");

quantityInput.addEventListener(

    "input",

    calculate

);

customPriceInput.addEventListener(

    "input",

    calculate

);

function calculate(){

    if(!currentBond){

        return;

    }

    const quantity =
    Number(quantityInput.value) || 1;

    const marketPrice =
    currentBond.price;

    const enteredPrice =
    Number(customPriceInput.value);

    const price =
    enteredPrice > 0
    ? enteredPrice
    : marketPrice;
        const purchaseCost =
    currentBond.nominal *
    price / 100 *
    quantity;

    const aci =
    currentBond.aci *
    quantity;

    const totalCost =
    purchaseCost +
    aci;

    const redemptionValue =
    currentBond.nominal *
    quantity;

    const couponIncome =
    currentBond.coupon *
    quantity;

    const profit =
    redemptionValue +
    couponIncome -
    totalCost;

    document.getElementById(
        "purchaseCost"
    ).textContent =
    purchaseCost.toFixed(2) +
    " " +
    currentBond.currency;

    document.getElementById(
        "purchaseACI"
    ).textContent =
    aci.toFixed(2) +
    " " +
    currentBond.currency;

    document.getElementById(
        "totalCost"
    ).textContent =
    totalCost.toFixed(2) +
    " " +
    currentBond.currency;

    document.getElementById(
        "couponIncome"
    ).textContent =
    couponIncome.toFixed(2) +
    " " +
    currentBond.currency;

    document.getElementById(
        "redemptionValue"
    ).textContent =
    redemptionValue.toFixed(2) +
    " " +
    currentBond.currency;

    document.getElementById(
        "profit"
    ).textContent =
    profit.toFixed(2) +
    " " +
    currentBond.currency;

    const simpleYield =
    totalCost > 0
    ? (profit / totalCost) * 100
    : 0;

    document.getElementById(
        "ytm"
    ).textContent =
    simpleYield.toFixed(2) +
    "%";
    }