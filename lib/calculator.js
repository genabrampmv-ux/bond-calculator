export function calculatePurchase({

    nominal,

    price,

    aci,

    quantity

}) {

    const purchaseCost =
        nominal *
        price / 100 *
        quantity;

    const accruedInterest =
        aci *
        quantity;

    const totalCost =
        purchaseCost +
        accruedInterest;

    return {

        purchaseCost,

        accruedInterest,

        totalCost

    };

}

export function calculateCoupons({

    coupon,

    quantity,

    couponCount

}) {

    const couponIncome =
        coupon *
        quantity *
        couponCount;

    return {

        couponIncome

    };

}

export function calculateProfit({

    purchaseCost,

    accruedInterest,

    couponIncome,

    redemptionValue,

    commission = 0

}) {

    const totalExpenses =
        purchaseCost +
        accruedInterest +
        commission;

    const totalIncome =
        couponIncome +
        redemptionValue;

    const profit =
        totalIncome -
        totalExpenses;

    return {

        totalExpenses,

        totalIncome,

        profit

    };

}

export function calculateYield({

    totalExpenses,

    profit,

    days

}) {

    const totalYield =

        totalExpenses > 0

            ? profit / totalExpenses * 100

            : 0;

    const annualYield =

        days > 0

            ? totalYield * 365 / days

            : 0;

    return {

        totalYield,

        annualYield

    };

}

