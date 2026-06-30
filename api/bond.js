export default async function handler(req, res) {

    const query = req.query.query;

    if (!query) {

        return res.status(400).json({

            success: false,

            message: "Не указан запрос"

        });

    }

    try {

        // ==========================
        // Поиск облигации
        // ==========================

        const searchUrl =
            `https://iss.moex.com/iss/securities.json?q=${encodeURIComponent(query)}&iss.meta=off`;

        const searchResponse =
            await fetch(searchUrl);

        const searchData =
            await searchResponse.json();

        const securities =
            searchData.securities;

        if (
            !securities ||
            securities.data.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message: "Облигация не найдена"

            });

        }

        const security = {};

        securities.columns.forEach(

            (column, index) => {

                security[column] =
                    securities.data[0][index];

            }

        );

        const secid =
            security.secid;
                    // ==========================
        // Подробная информация
        // ==========================

        const detailUrl =
            `https://iss.moex.com/iss/securities/${secid}.json?iss.meta=off`;

        const detailResponse =
            await fetch(detailUrl);

        const detailData =
            await detailResponse.json();

        const description =
            {};

        if (
            detailData.description &&
            detailData.description.data
        ) {

            detailData.description.data.forEach(

                item => {

                    description[item[0]] =
                        item[2];

                }

            );

        }

        const bond = {

            name:
                security.name ||
                security.shortname,

            isin:
                security.isin,

            secid,

            nominal:
                Number(
                    description.FACEVALUE
                ) || 1000,

            currency:
                description.FACEUNIT ||
                "RUB",

            maturity:
                description.MATDATE ||
                null,

            offer:
                description.OFFERDATE ||
                null,

            coupon:
                Number(
                    description.COUPONVALUE
                ) || 0,

            couponRate:
                Number(
                    description.COUPONPERCENT
                ) || 0

        };
                // ==========================
        // Рыночные данные
        // ==========================

        const marketUrl =
            `https://iss.moex.com/iss/engines/stock/markets/bonds/securities/${secid}.json?iss.meta=off`;

        const marketResponse =
            await fetch(marketUrl);

        const marketData =
            await marketResponse.json();

        if (
            marketData.marketdata &&
            marketData.marketdata.data &&
            marketData.marketdata.data.length > 0
        ) {

            const md = {};

            marketData.marketdata.columns.forEach(

                (column, index) => {

                    md[column] =
                        marketData.marketdata.data[0][index];

                }

            );

            bond.price =
                Number(
                    md.LAST ||
                    md.MARKETPRICE ||
                    md.LEGALCLOSEPRICE ||
                    0
                );

            bond.aci =
                Number(
                    md.ACCRUEDINT ||
                    0
                );

            bond.yieldToOffer =
                Number(
                    md.YIELDTOOFFER ||
                    0
                );

        } else {

            bond.price = 0;
            bond.aci = 0;
            bond.yieldToOffer = 0;

        }
                // ==========================
        // Ответ API
        // ==========================

        return res.status(200).json({

            success: true,

            bond

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}