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