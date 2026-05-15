const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

function normalizePhone(phone) {
    phone = phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {
        phone = "254" + phone.substring(1);
    }

    return phone;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.post("/send-bulk", async (req, res) => {

    const {
        phones,
        amount,
        reference,
        description
    } = req.body;

    if (!phones || phones.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No phone numbers provided"
        });
    }

    const results = [];

    for (const rawPhone of phones) {

        const phone = normalizePhone(rawPhone);

        try {

            const payload = {
                payment_account_id: process.env.PAYMENT_ACCOUNT_ID,
                phone,
                amount,
                reference,
                description
            };

            const response = await axios.post(
                "https://optimapaybridge.co.ke/api/v2/stkpush.php",
                payload,
                {
                    headers: {
                        "X-API-Key": process.env.API_KEY,
                        "X-API-Secret": process.env.API_SECRET,
                        "Content-Type": "application/json"
                    }
                }
            );

            results.push({
                phone,
                success: true,
                response: response.data
            });

        } catch (error) {

            results.push({
                phone,
                success: false,
                error: error.response?.data || error.message
            });

        }

        // Safe delay between requests
        await delay(3000);
    }

    res.json({
        success: true,
        total: results.length,
        results
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});