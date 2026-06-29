export default async function handler(req, res) {

    const query = req.query.query;

    if (!query) {

        return res.status(400).json({

            success: false,

            message: "Не указан запрос"

        });

    }

    try {

        // -----------------------------
        // Поиск облигации
        // -----------------------------

        const searchUrl =
            `https://iss.moex.com/iss/securities.json?q=${encodeURIComponent(query)}`;

        const searchResponse = await fetch(searchUrl);

        const searchData = await searchResponse.json();

        const securities = searchData.securities;

        if (!securities || securities.data.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Облигация не найдена"

            });

        }

        const columns = securities.columns;

        const row = securities.data[0];

        const security = {};

        columns.forEach((name, index) => {

            security[name] = row[index];

        });

        const secid = security.secid;

        // -----------------------------
        // Детальная информация
        // -----------------------------

        const detailUrl =
            `https://iss.moex.com/iss/securities/${secid}.json?iss.meta=off`;

        const detailResponse = await fetch(detailUrl);

        const detailData = await detailResponse.json();

        const description = detailData.description;

        const desc = {};

        description.data.forEach(item => {

            desc[item[0]] = item[2];

        });

        // -----------------------------
        // Подготовка ответа
        // -----------------------------

        const bond = {

            name:
                security.name || security.shortname,

            isin:
                security.isin,

            secid,

            nominal:
                Number(desc.FACEVALUE) || 1000,

            currency:
                desc.FACEUNIT || "RUB",

            maturity:
                desc.MATDATE || null,

            offer:
                desc.OFFERDATE || null,

            coupon:
                Number(desc.COUPONVALUE) || 0

        };

        return res.status(200).json({

            success: true,

            bond

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

