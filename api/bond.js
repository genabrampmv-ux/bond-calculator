import {

    searchBond,

    getMarketData

} from "../lib/moex";

export default async function handler(req, res) {

    const query = req.query.query;

    if (!query) {

        return res.status(400).json({

            success: false,

            message: "Не указан запрос"

        });

    }

    try {

        const security = await searchBond(query);

        const secid = security.secid;
        const board =
    security.primary_boardid ||
    "TQCB";
                const detailUrl =
            `https://iss.moex.com/iss/securities/${secid}.json?iss.meta=off`;

        const detailResponse =
            await fetch(detailUrl);

        if (!detailResponse.ok) {

            throw new Error("Ошибка получения информации об облигации");

        }

        const detailData =
            await detailResponse.json();

        const description = {};

        if (
            detailData.description &&
            detailData.description.data
        ) {

            detailData.description.data.forEach(item => {

                description[item[0]] = item[2];

            });

        }

        const bond = {

            name:
                security.name ||
                security.shortname,

            isin:
                security.isin,

            secid,

            nominal:
                Number(description.FACEVALUE) || 1000,

            currency:
                description.FACEUNIT || "RUB",

            maturity:
                description.MATDATE || null,

            offer:
                description.OFFERDATE || null,

            coupon:
                Number(description.COUPONVALUE) || 0,

            couponRate:
                Number(description.COUPONPERCENT) || 0,

            price: 0,

            aci: 0,

            yieldToOffer: 0

        };
              const market =

    await getMarketData(

        secid,

        board

    );

bond.price =

    market.price;

bond.aci =

    market.aci;
    bond.nextCoupon =

    market.nextCoupon;

bond.couponPeriod =

    market.couponPeriod;
                return res.status(200).json({

            success: true,

            bond

        });

    } catch (error) {

        console.error(error);

return res.status(500).json({

    success:false,

    message:error.message,

    stack:error.stack

});

    }

}
