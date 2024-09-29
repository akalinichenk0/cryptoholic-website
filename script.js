// Function to fetch real-time data from CoinGecko API
async function fetchRealData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        
        // Map the API response to your data structure
        return {
            marketCap: `$${(data.data.total_market_cap.usd / 1e12).toFixed(2)}T`,
            volume24h: `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`,
            btcDominance: `${data.data.market_cap_percentage.btc.toFixed(2)}%`,
            ethDominance: `${data.data.market_cap_percentage.eth.toFixed(2)}%`,
            fearGreedIndex: {
                value: 64, // Static for now (replace with a real API later if available)
                sentiment: "Greed"
            },
            altcoinSeasonIndex: {
                value: 0, // Static for now (replace with a real API later if available)
                sentiment: "Bitcoin Season"
            },
            topCryptos: [
                { name: "Bitcoin", price: "$65,714", change: "-0.29%" }, // Static
                { name: "Ethereum", price: "$2,677", change: "-0.92%" }, // Static
                { name: "Solana", price: "$156.73", change: "-0.98%" }   // Static
            ],
            additionalMetrics: {
                totalLiquidations: {
                    long: "$0.00", // Placeholder for future API
                    short: "$0.00" // Placeholder for future API
                },
                totalValueLocked: "$0.00", // Placeholder for future API
                networkHashRate: "0.58 TH/s", // Static
                transactionVolume: `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`
            }
        };
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
}

// Function to update the date dynamically
function updateDate() {
    const dateElement = document.getElementById("date");
    const today = new Date();
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    dateElement.textContent = formattedDate;
}

// Function to update the DOM with fetched data
function updateDOM(data) {
    if (!data) {
        console.error('No data available to update the DOM');
        return;
    }

    // Market overview section
    document.querySelector("#marketCapValue").textContent = data.marketCap;
    document.querySelector("#volume24hValue").textContent = data.volume24h;
    document.querySelector("#btcDominanceValue").textContent = data.btcDominance;
    document.querySelector("#ethDominanceValue").textContent = data.ethDominance;

    // Sentiment indicators section
    document.querySelector("#greedScore").textContent = `${data.fearGreedIndex.value}`;
    document.querySelector("#greedLevel").textContent = `${data.fearGreedIndex.sentiment}`;
    document.querySelector("#seasonScore").textContent = `${data.altcoinSeasonIndex.value}`;
    document.querySelector("#seasonSentiment").textContent = `${data.altcoinSeasonIndex.sentiment}`;

    // Top cryptos section with red/green indicators for profit/loss
    const topCryptos = data.topCryptos;

    topCryptos.forEach((crypto, index) => {
        const priceElement = document.querySelector(`#crypto${index + 1}PriceValue`);
        const changeElement = document.querySelector(`#crypto${index + 1}Change`);

        priceElement.textContent = crypto.price;

        // Check if the change is positive or negative and apply appropriate color
        const changeValue = parseFloat(crypto.change);
        if (changeValue >= 0) {
            changeElement.textContent = `+${crypto.change}`;
            changeElement.style.color = "green"; // Green for profit
        } else {
            changeElement.textContent = `${crypto.change}`;
            changeElement.style.color = "red"; // Red for loss
        }
    });

    // Additional metrics section
    document.querySelector("#liquidationsLong").textContent = data.additionalMetrics.totalLiquidations.long;
    document.querySelector("#liquidationsShort").textContent = data.additionalMetrics.totalLiquidations.short;
    document.querySelector("#totalValueLocked").textContent = data.additionalMetrics.totalValueLocked;
    document.querySelector("#networkHash").textContent = data.additionalMetrics.networkHashRate;
    document.querySelector("#transactionVol").textContent = data.additionalMetrics.transactionVolume;
}

// Fetch real data and update the DOM on page load
document.addEventListener('DOMContentLoaded', async function () {
    updateDate(); // Update the date dynamically
    const realData = await fetchRealData(); // Fetch real data from the API
    updateDOM(realData);                    // Update the DOM with the data
});
