export default async function handler(req, res) {

    const query = req.query.query;

    if (!query) {

        return res.status(400).json({

            success: false,

            message: "Не указан ISIN"

        });

    }

    try {

        const searchUrl =
            `https://iss.moex.com/iss/securities.json?q=${encodeURIComponent(query)}`;

        const response = await fetch(searchUrl);

        if (!response.ok) {

            throw new Error("Ошибка Московской биржи");

        }

        const data = await response.json();

        const securities = data.securities;

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

        return res.status(200).json({

            success: true,

            security

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
